import {
  App,
  Button,
  Card,
  Divider,
  Empty,
  Input,
  Modal,
  Select,
  Space,
  Typography,
  Spin,
} from 'antd';
import type { InputRef } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useMemo, useRef, useEffect } from 'react';
import type { DietOptionSchema } from '@/shared/types/schema';
import {
  type DayPlan,
  mealSlotsToDayPlans,
  dayPlanToMealSlotUpserts,
} from '../apiAdapter';
import DietDayList from '../components/DietDayList';
import DietEditModal from '../components/DietEditModal';
import {
  handleExportDietPdf,
  dietPrintStyles,
} from '../components/handleExportDietPdf';
import { useDietCategoryList } from '../hooks/useDietCategoryList';
import { useDietDishDetails } from '../hooks/useDietDishDetails';
import { useDietMenuList } from '../hooks/useDietMenuList';
import { useDietCategoryCreate } from '../hooks/useDietCategoryCreate';
import { useDietCategoryUpdate } from '../hooks/useDietCategoryUpdate';
import { useDietCategoryDelete } from '../hooks/useDietCategoryDelete';
import { useDietSaveWeeklyMenu } from '../hooks/useDietSaveWeeklyMenu';

const { Title, Text } = Typography;

export default function DietBoardPage() {
  const { message } = App.useApp();
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
  } = useDietCategoryList();
  const activeCategoryId = selectedCategoryId || dietCategories[0]?.id || 0;
  const {
    menuRows,
    isLoading: loadingMenus,
    isError: menuError,
    mutate: mutateMenus,
  } = useDietMenuList({
    dietId: activeCategoryId || undefined,
  });
  const { trigger: createDiet } = useDietCategoryCreate();
  const { trigger: updateDiet } = useDietCategoryUpdate();
  const { trigger: deleteDiet } = useDietCategoryDelete();
  const { trigger: saveWeeklyMenu } = useDietSaveWeeklyMenu();

  useEffect(() => {
    if (dietError) {
      console.error('Failed to fetch diets:', dietError);
      message.error('加载套餐类别失败');
    }
  }, [dietError, message]);

  useEffect(() => {
    if (menuError) {
      console.error('Failed to fetch weekly menus:', menuError);
      message.error('加载周菜单失败');
    }
  }, [menuError, message]);

  const dayPlans = useMemo(() => {
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return mealSlotsToDayPlans(menuRows, (day) => dayNames[day - 1] ?? '');
  }, [menuRows]);

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
    useDietDishDetails(dishIds);

  const createDietCategory = async () => {
    if (
      newCategoryName &&
      !dietCategories.some((c) => c.name === newCategoryName)
    ) {
      try {
        const response = await createDiet({ name: newCategoryName });
        const newCategory = response.result;
        await mutateDiets();
        setSelectedCategoryId(newCategory.id);
        setNewCategoryName('');
        setSelectOpen(false);
        message.success('套餐类别已创建');
      } catch (err) {
        console.error('Failed to create diet:', err);
        message.error('创建套餐类别失败');
      }
    }
  };

  const addDietCategory = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    await createDietCategory();
  };

  // ─── Rename diet category ───
  const handleRenameDiet = (diet: DietOptionSchema) => {
    let newName = diet.name;
    Modal.confirm({
      title: '重命名套餐类别',
      content: (
        <Input
          defaultValue={diet.name}
          onChange={(e) => {
            newName = e.target.value;
          }}
          placeholder={'输入新名称'}
        />
      ),
      okText: '保存',
      cancelText: '取消',
      onOk: async () => {
        if (!newName || newName === diet.name) return;
        try {
          await updateDiet(diet.id, { name: newName });
          await mutateDiets();
          message.success('套餐类别已重命名');
        } catch (err) {
          console.error('Failed to rename diet:', err);
          message.error('重命名失败');
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
      const latest = response?.result ?? [];
      const deleted = !latest.some((c) => c.id === dietId);

      if (activeCategoryId === dietId) {
        setSelectedCategoryId(latest.length > 0 ? latest[0].id : 0);
      }

      if (deleted) {
        message.success('套餐类别已删除');
        return;
      }
    } catch (syncErr) {
      console.error('Failed to refresh diets after delete:', syncErr);
    }

    message.error('删除失败');
  };

  const handleEdit = (day: DayPlan) => {
    setEditingDay(day);
    setIsModalVisible(true);
  };

  const handleSave = async (updatedDay: DayPlan) => {
    const mealSlots = dayPlanToMealSlotUpserts(updatedDay);

    try {
      await saveWeeklyMenu(activeCategoryId, mealSlots);
      message.success('菜单已保存');
      setIsModalVisible(false);
      await mutateMenus();
    } catch (err) {
      console.error('Failed to save weekly menu:', err);
      message.error('保存菜单失败');
    }
  };

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-between">
        <Title level={3} className="m-0!">
          {'标准膳食计划'}
        </Title>
        <Space>
          <Select
            value={dietCategories.length ? activeCategoryId : undefined}
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
                      className="text-primary!"
                    />
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        Modal.confirm({
                          title: '确认删除',
                          content: `确定要删除套餐类别「${diet.name}」吗？该类别下的所有菜单数据也将被删除。`,
                          okText: '删除',
                          okType: 'danger',
                          cancelText: '取消',
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
                    placeholder={'新套餐名称'}
                    ref={inputRef}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button icon={<PlusOutlined />} onClick={addDietCategory}>
                    {'添加'}
                  </Button>
                </div>
              </>
            )}
          />
          <Button
            onClick={() =>
              handleExportDietPdf({
                message,
                categoryName:
                  dietCategories.find((c) => c.id === activeCategoryId)?.name ??
                  '未知套餐',
                dayPlans,
                dishDetails,
              })
            }
          >
            {'导出 PDF / 打印'}
          </Button>
        </Space>
      </div>

      {/* Print Header */}
      <div className="print-only mb-5 hidden text-center">
        <Title level={3} className="m-0!">
          {'标准膳食计划'}
        </Title>
        <Title level={3} className="my-2!">
          {dietCategories.find((c) => c.id === activeCategoryId)?.name ??
            '未知套餐'}
          {'配料表'}
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
                  {'暂无套餐类别'}
                </Text>
                <Text type="secondary" className="mt-1 mb-4">
                  {'请先添加一个套餐类别开始制定菜单'}
                </Text>
                <Space>
                  <Input
                    placeholder={'新套餐名称'}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{ width: 200 }}
                    onPressEnter={createDietCategory}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addDietCategory}
                  >
                    {'添加'}
                  </Button>
                </Space>
              </div>
            }
          />
        </Card>
      ) : (
        <Spin spinning={loadingMenus || loadingDiets}>
          <DietDayList
            days={dayPlans}
            dishDetails={dishDetails}
            loadingDishDetails={loadingDishDetails}
            onEdit={handleEdit}
          />
        </Spin>
      )}

      <DietEditModal
        visible={isModalVisible}
        dayData={editingDay}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
      />

      <style>{dietPrintStyles}</style>
    </div>
  );
}
