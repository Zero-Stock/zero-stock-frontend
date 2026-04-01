import {
  Button,
  Card,
  Divider,
  Empty,
  Input,
  Modal,
  Select,
  Space,
  Typography,
  message,
  Spin,
} from 'antd';
import type { InputRef } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useMemo, useRef, useEffect } from 'react';
import { type DayPlan, type DietCategory } from '../mockdata';
import { rowsToDayPlans, dayPlanToBatchItems } from '../apiAdapter';
import MealDayCards from './MealDayCards';
import MealEditModal from './MealEditModal';
import { handleExportMealPdf, mealPrintStyles } from './handleExportMealPdf';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useMealDietList } from '../hooks/useMealDietList';
import { useMealDishDetails } from '../hooks/useMealDishDetails';
import { useMealMenuList } from '../hooks/useMealMenuList';
import { useMealCreateDiet } from '../hooks/useMealCreateDiet';
import { useMealUpdateDiet } from '../hooks/useMealUpdateDiet';
import { useMealDeleteDiet } from '../hooks/useMealDeleteDiet';
import { useMealSaveWeeklyMenu } from '../hooks/useMealSaveWeeklyMenu';

const { Title, Text } = Typography;

const COMPANY_ID = 1; // TODO: get from auth context

export default function MealBoard() {
  const { t } = useTranslation();
  const [newCategoryName, setNewCategoryName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectOpen, setSelectOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDay, setEditingDay] = useState<DayPlan | null>(null);

  const {
    diets: dietCategories,
    isLoading: loadingDiets,
    isError: dietError,
    mutate: mutateDiets,
  } = useMealDietList();
  const {
    menuRows,
    isLoading: loadingMenus,
    isError: menuError,
    mutate: mutateMenus,
  } = useMealMenuList({
    companyId: COMPANY_ID,
    dietCategoryId: selectedCategoryId || undefined,
  });
  const { trigger: createDiet } = useMealCreateDiet();
  const { trigger: updateDiet } = useMealUpdateDiet();
  const { trigger: deleteDiet } = useMealDeleteDiet();
  const { trigger: saveWeeklyMenu } = useMealSaveWeeklyMenu();

  useEffect(() => {
    if (dietCategories.length > 0 && selectedCategoryId === 0) {
      setSelectedCategoryId(dietCategories[0].id);
    }
  }, [dietCategories, selectedCategoryId]);

  useEffect(() => {
    if (dietError) {
      console.error('Failed to fetch diets:', dietError);
      message.error(t('mealLoadDietsFailed'));
    }
  }, [dietError, t]);

  useEffect(() => {
    if (menuError) {
      console.error('Failed to fetch weekly menus:', menuError);
      message.error(t('mealLoadMenuFailed'));
    }
  }, [menuError, t]);

  // Convert flat rows → grouped day plans for the selected diet category
  const dayPlans = useMemo(() => {
    const filtered = menuRows.filter(
      (r) => r.diet_category === selectedCategoryId,
    );
    return rowsToDayPlans(filtered, (d) => t(`day${d}` as any));
  }, [menuRows, selectedCategoryId, t]);

  const dishIds = useMemo(
    () =>
      dayPlans.flatMap((day) => [
        ...day.breakfast.map((d) => d.id),
        ...day.lunch.map((d) => d.id),
        ...day.dinner.map((d) => d.id),
      ]),
    [dayPlans],
  );
  const { dishDetails, isLoading: loadingDishDetails } =
    useMealDishDetails(dishIds);

  const addDietCategory = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      newCategoryName &&
      !dietCategories.some((c) => c.name === newCategoryName)
    ) {
      try {
        const response = await createDiet(newCategoryName);
        const newCategory = response.results;
        await mutateDiets();
        setSelectedCategoryId(newCategory.id);
        setNewCategoryName('');
        setSelectOpen(false);
        message.success(t('mealDietCreated'));
      } catch (err) {
        console.error('Failed to create diet:', err);
        message.error(t('mealDietCreateFailed'));
      }
    }
  };

  // ─── Rename diet category ───
  const handleRenameDiet = (diet: DietCategory) => {
    let newName = diet.name;
    Modal.confirm({
      title: t('mealRenameTitle'),
      content: (
        <Input
          defaultValue={diet.name}
          onChange={(e) => {
            newName = e.target.value;
          }}
          placeholder={t('mealRenameInput')}
        />
      ),
      okText: t('save'),
      cancelText: t('cancel'),
      onOk: async () => {
        if (!newName || newName === diet.name) return;
        try {
          await updateDiet(diet.id, newName);
          await mutateDiets();
          message.success(t('mealDietRenamed'));
        } catch (err) {
          console.error('Failed to rename diet:', err);
          message.error(t('mealDietRenameFailed'));
        }
      },
    });
  };

  // ─── Delete diet category ───
  const handleDeleteDiet = async (dietId: number) => {
    try {
      await deleteDiet(dietId);
    } catch (err) {
      // Some backends may delete successfully but still return a bad/empty response.
      // We'll verify by reloading diets before deciding the final UI message.
      console.warn(
        'Delete diet request errored, verifying with fresh data...',
        err,
      );
    }

    try {
      const response = await mutateDiets();
      const latest = response?.results ?? [];
      const deleted = !latest.some((c) => c.id === dietId);

      if (selectedCategoryId === dietId) {
        setSelectedCategoryId(latest.length > 0 ? latest[0].id : 0);
      }

      if (deleted) {
        message.success(t('mealDietDeleted'));
        return;
      }
    } catch (syncErr) {
      console.error('Failed to refresh diets after delete:', syncErr);
    }

    message.error(t('mealDietDeleteFailed'));
  };

  const handleEdit = (day: DayPlan) => {
    setEditingDay(day);
    setIsModalVisible(true);
  };

  const handleSave = async (updatedDay: DayPlan) => {
    // Build the batch payload for POST /api/weekly-menus/batch/
    const batchItems = dayPlanToBatchItems(
      updatedDay,
      COMPANY_ID,
      selectedCategoryId,
    );

    try {
      await saveWeeklyMenu(batchItems);
      message.success(t('mealSaved'));
      setIsModalVisible(false);
      await mutateMenus();
    } catch (err) {
      console.error('Failed to save weekly menu:', err);
      message.error(t('mealSaveFailed'));
    }
  };

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-between">
        <Title level={3} className="m-0!">
          {t('mealBoardTitle')}
        </Title>
        <Space>
          <Select
            value={dietCategories.length ? selectedCategoryId : undefined}
            className="w-80"
            open={selectOpen}
            onOpenChange={setSelectOpen}
            onChange={(val) => {
              setSelectedCategoryId(val);
              setSelectOpen(false);
            }}
            options={dietCategories.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
            optionRender={(option) => {
              const diet = dietCategories.find((c) => c.id === option.value);
              if (!diet) return option.label;
              return (
                <div className="flex items-center justify-between">
                  <span>{diet.name}</span>
                  <Space size={4} onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameDiet(diet);
                      }}
                      style={{ color: '#1890ff' }}
                    />
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        Modal.confirm({
                          title: t('mealDeleteConfirm'),
                          content: t('mealDeleteConfirmContent', {
                            name: diet.name,
                          }),
                          okText: t('delete'),
                          okType: 'danger',
                          cancelText: t('cancel'),
                          onOk: () => handleDeleteDiet(diet.id),
                        });
                      }}
                    />
                  </Space>
                </div>
              );
            }}
            popupRender={(menu) => (
              <>
                {menu}
                <Divider className="my-2!" />
                <div className="flex items-center justify-between gap-2 p-2">
                  <Input
                    placeholder={t('mealNewDietPlaceholder')}
                    ref={inputRef}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button icon={<PlusOutlined />} onClick={addDietCategory}>
                    {t('mealAddDiet')}
                  </Button>
                </div>
              </>
            )}
          />
          <Button onClick={handleExportMealPdf}>{t('commonExportPdf')}</Button>
        </Space>
      </div>

      {/* Print Header */}
      <div className="print-only mb-5 hidden text-center">
        <Title level={3} className="m-0!">
          {t('mealPrintTitle')}
        </Title>
        <Title level={3} className="my-2!">
          {dietCategories.find((c) => c.id === selectedCategoryId)?.name ??
            t('mealUnknownDiet')}
          {t('mealConfigSheet')}
        </Title>
      </div>

      {!loadingDiets && dietCategories.length === 0 ? (
        <Card
          className="mt-8 text-center"
          styles={{ body: { padding: '40px 0' } }}
        >
          <Empty
            description={
              <div className="flex flex-col items-center">
                <Text strong className="text-lg">
                  {t('mealNoDietTitle')}
                </Text>
                <Text type="secondary" className="mt-1 mb-4">
                  {t('mealNoDietDesc')}
                </Text>
                <Space>
                  <Input
                    placeholder={t('mealNewDietPlaceholder')}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{ width: 200 }}
                    onPressEnter={(e) => addDietCategory(e as any)}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addDietCategory}
                  >
                    {t('mealAddDiet')}
                  </Button>
                </Space>
              </div>
            }
          />
        </Card>
      ) : (
        <Spin spinning={loadingMenus || loadingDiets}>
          <MealDayCards
            days={dayPlans}
            dishDetails={dishDetails}
            loadingDishDetails={loadingDishDetails}
            onEdit={handleEdit}
          />
        </Spin>
      )}

      <MealEditModal
        visible={isModalVisible}
        dayData={editingDay}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
      />

      <style>{mealPrintStyles}</style>
    </div>
  );
}
