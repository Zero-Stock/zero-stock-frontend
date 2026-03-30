import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  message,
  Spin,
} from 'antd';
import type { InputRef } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  type DishItem,
  type DayPlan,
  type DietCategory,
  type DishDetail,
  type WeeklyMenuRow,
} from '../mockdata';
import type { PaginatedResponse, Dish } from '@/modules/dish/mockdata';
import { apiClient } from '@/shared/api/apiClient.client';
import { fetchDishDetails } from '../dishService';
import { rowsToDayPlans, dayPlanToBatchItems } from '../apiAdapter';
import MealEditModal from './MealEditModal';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title, Text } = Typography;

const COMPANY_ID = 1; // TODO: get from auth context

export default function MealBoard() {
  const { t } = useTranslation();
  const [dietCategories, setDietCategories] = useState<DietCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [menuRows, setMenuRows] = useState<WeeklyMenuRow[]>([]);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDiets, setLoadingDiets] = useState(true);

  // ─── Fetch diet categories from API ───
  const fetchDiets = useCallback(async () => {
    try {
      setLoadingDiets(true);
      const response = await apiClient.get<{ results: DietCategory[] }>(
        '/api/diets/',
      );
      const data = response.results;
      setDietCategories(data);
      if (data.length > 0 && selectedCategoryId === 0) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch diets:', err);
      message.error(t('mealLoadDietsFailed'));
    } finally {
      setLoadingDiets(false);
    }
  }, [selectedCategoryId, t]);

  // ─── Fetch weekly menus from API ───
  const fetchMenus = useCallback(async () => {
    if (!selectedCategoryId) return;
    setLoading(true);
    try {
      const response = await apiClient.get<{
        results: PaginatedResponse<WeeklyMenuRow>;
      }>('/api/weekly-menus/', {
        query: {
          company: COMPANY_ID,
          diet_category: selectedCategoryId,
          page_size: 200,
        },
      });
      setMenuRows(response.results.results);
    } catch (err) {
      console.error('Failed to fetch weekly menus:', err);
      message.error(t('mealLoadMenuFailed'));
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId]);

  // ─── Fetch all dishes for the Select dropdown ───
  const fetchAllDishes = useCallback(async () => {
    try {
      const response = await apiClient.get<{
        results: PaginatedResponse<Dish>;
      }>('/api/dishes/', { query: { page_size: 500 } });
      setAllDishes(response.results.results);
    } catch (err) {
      console.error('Failed to fetch dishes:', err);
      message.error(t('mealLoadDishesFailed'));
    }
  }, []);

  useEffect(() => {
    fetchDiets();
  }, [fetchDiets]);
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);
  useEffect(() => {
    fetchAllDishes();
  }, [fetchAllDishes]);

  // Convert flat rows → grouped day plans for the selected diet category
  const dayPlans = useMemo(() => {
    const filtered = menuRows.filter(
      (r) => r.diet_category === selectedCategoryId,
    );
    return rowsToDayPlans(filtered, (d) => t(`day${d}` as any));
  }, [menuRows, selectedCategoryId, t]);

  // ─── Fetch dish details (ingredients) for display ───
  const [dishDetails, setDishDetails] = useState<Map<number, DishDetail>>(
    new Map(),
  );

  const loadDishDetails = useCallback(async () => {
    const allDishIds = dayPlans.flatMap((day) => [
      ...day.breakfast.map((d) => d.id),
      ...day.lunch.map((d) => d.id),
      ...day.dinner.map((d) => d.id),
    ]);
    if (allDishIds.length > 0) {
      const details = await fetchDishDetails(allDishIds);
      setDishDetails(details);
    }
  }, [dayPlans]);

  useEffect(() => {
    loadDishDetails();
  }, [loadDishDetails]);

  // ─── Add diet category ───
  const [selectOpen, setSelectOpen] = useState(false);

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
        const response = await apiClient.post<{ results: DietCategory }>(
          '/api/diets/',
          {
            body: { name: newCategoryName },
          },
        );
        const newCategory = response.results;
        setDietCategories([...dietCategories, newCategory]);
        setSelectedCategoryId(newCategory.id);
        setNewCategoryName('');
        setSelectOpen(false); // close dropdown so it refreshes on reopen
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
          await apiClient.put<DietCategory>(`/api/diets/${diet.id}/`, {
            body: { name: newName },
          });
          message.success(t('mealDietRenamed'));
          fetchDiets();
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
      await apiClient.delete(`/api/diets/${dietId}/`);
    } catch (err) {
      // Some backends may delete successfully but still return a bad/empty response.
      // We'll verify by reloading diets before deciding the final UI message.
      console.warn(
        'Delete diet request errored, verifying with fresh data...',
        err,
      );
    }

    try {
      const response = await apiClient.get<{ results: DietCategory[] }>(
        '/api/diets/',
      );
      const latest = response.results;
      const deleted = !latest.some((c) => c.id === dietId);

      setDietCategories(latest);
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDay, setEditingDay] = useState<DayPlan | null>(null);

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
      await apiClient.post('/api/weekly-menus/batch/', {
        body: batchItems,
      });
      message.success(t('mealSaved'));
      setIsModalVisible(false);
      fetchMenus(); // refresh from API
    } catch (err) {
      console.error('Failed to save weekly menu:', err);
      message.error(t('mealSaveFailed'));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderMealSection = (sectionTitle: string, dishes: DishItem[]) => (
    <div className="mb-3">
      <Text
        strong
        className="print-meal-title mb-1 block"
        style={{ color: '#1890ff' }}
      >
        {sectionTitle}
      </Text>
      {dishes.length === 0 ? (
        <Text type="secondary" italic>
          {t('none')}
        </Text>
      ) : (
        <ul className="m-0 list-disc pl-4">
          {dishes.map((dish, idx) => {
            const detail = dishDetails.get(dish.id);
            return (
              <li key={idx} className="mb-2">
                <span>
                  <Text strong>{dish.name}</Text>
                  {dish.count && dish.count > 1 && (
                    <Text
                      className="ml-1 font-semibold"
                      style={{ color: '#1890ff' }}
                    >
                      x{dish.count}
                    </Text>
                  )}
                </span>
                {/* Read-only ingredients from Dish API */}
                {detail && detail.ingredients.length > 0 && (
                  <div className="mt-0.5 pl-1 text-xs text-gray-500">
                    {detail.ingredients
                      .map((ing) => {
                        const grams = Math.round(
                          parseFloat(ing.net_quantity) * 1000,
                        );
                        return `${ing.raw_material_name}${ing.processing_name !== '无' ? `[${ing.processing_name}]` : ''} ${grams}g`;
                      })
                      .join('、')}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const renderDayCards = (days: DayPlan[]) => (
    <Row gutter={[16, 16]} className="print-row">
      {days.map((day) => (
        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={6}
          key={day.dayOfWeek}
          className="print-col"
        >
          <Card
            title={day.dayOfWeek}
            extra={
              <Button
                type="link"
                onClick={() => handleEdit(day)}
                className="no-print"
              >
                {t('edit')}
              </Button>
            }
            className="print-card h-full"
            styles={{ body: { padding: '12px' } }}
          >
            {renderMealSection(t('mealBreakfast'), day.breakfast)}
            <Divider className="print-divider my-2!" />
            {renderMealSection(t('mealLunch'), day.lunch)}
            <Divider className="print-divider my-2!" />
            {renderMealSection(t('mealDinner'), day.dinner)}
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-between">
        <Title level={2} className="m-0!">
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
          <Button onClick={handlePrint}>{t('commonExportPdf')}</Button>
        </Space>
      </div>

      {/* Print Header */}
      <div className="print-only mb-5 hidden text-center">
        <Title level={2} className="m-0!">
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
        <Spin spinning={loading || loadingDiets}>
          {renderDayCards(dayPlans)}
        </Spin>
      )}

      <MealEditModal
        visible={isModalVisible}
        dayData={editingDay}
        availableDishes={allDishes}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
      />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body {
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
          }
          * { color: #000 !important; }
          .ant-layout-sider,
          .ant-layout-header,
          .ant-layout-footer,
          nav {
            display: none !important;
          }
          .ant-layout-content {
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            min-height: auto !important;
          }
          /* Force all parent containers to allow overflow so it prints multiple pages */
          html, body, #root, .ant-layout, .ant-pro-layout, .ant-pro-layout-content, div {
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
          }
          /* Override Tailwind utility classes and inline styles */
          [style*="overflow: hidden"], [style*="overflow: auto"], [style*="height: 100vh"] {
            overflow: visible !important;
            height: auto !important;
          }
          .print-row { display: block !important; }
          .print-col {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 10px !important;
            page-break-inside: avoid;
          }
          .print-card {
            border: 1px solid #000 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .ant-card-head {
            border-bottom: 1px solid #000 !important;
            min-height: auto !important;
            padding: 4px 12px !important;
            background-color: #f0f0f0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .ant-card-head-title {
            padding: 4px 0 !important;
            font-weight: bold;
          }
          .print-divider {
            border-block-start-color: #000 !important;
            margin: 4px 0 !important;
          }
          .print-meal-title {
            text-decoration: underline;
            margin-bottom: 2px !important;
          }
          ul { margin-bottom: 0 !important; }
        }
      `}</style>
    </div>
  );
}
