import {
    Button,
    Card,
    Col,
    Divider,
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

const { Title, Text } = Typography;

const COMPANY_ID = 1; // TODO: get from auth context

export default function MealBoard() {
    const [dietCategories, setDietCategories] = useState<DietCategory[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const inputRef = useRef<InputRef>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [menuRows, setMenuRows] = useState<WeeklyMenuRow[]>([]);
    const [allDishes, setAllDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(false);

    // ─── Fetch diet categories from API ───
    const fetchDiets = useCallback(async () => {
        try {
            const data = await apiClient.get<DietCategory[]>('/api/diets/');
            setDietCategories(data);
            if (data.length > 0 && selectedCategoryId === 0) {
                setSelectedCategoryId(data[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch diets:', err);
            message.error('加载套餐类别失败');
        }
    }, []);

    // ─── Fetch weekly menus from API ───
    const fetchMenus = useCallback(async () => {
        if (!selectedCategoryId) return;
        setLoading(true);
        try {
            const data = await apiClient.get<PaginatedResponse<WeeklyMenuRow>>(
                '/api/weekly-menus/',
                { query: { company: COMPANY_ID, diet_category: selectedCategoryId, page_size: 200 } },
            );
            setMenuRows(data.results);
        } catch (err) {
            console.error('Failed to fetch weekly menus:', err);
            message.error('加载周菜单失败');
        } finally {
            setLoading(false);
        }
    }, [selectedCategoryId]);

    // ─── Fetch all dishes for the Select dropdown ───
    const fetchAllDishes = useCallback(async () => {
        try {
            const data = await apiClient.get<PaginatedResponse<Dish>>(
                '/api/dishes/',
                { query: { page_size: 500 } },
            );
            setAllDishes(data.results);
        } catch (err) {
            console.error('Failed to fetch dishes:', err);
            message.error('加载菜品列表失败');
        }
    }, []);

    useEffect(() => { fetchDiets(); }, [fetchDiets]);
    useEffect(() => { fetchMenus(); }, [fetchMenus]);
    useEffect(() => { fetchAllDishes(); }, [fetchAllDishes]);

    // Convert flat rows → grouped day plans for the selected diet category
    const dayPlans = useMemo(() => {
        const filtered = menuRows.filter(
            (r) => r.diet_category === selectedCategoryId,
        );
        return rowsToDayPlans(filtered);
    }, [menuRows, selectedCategoryId]);

    // ─── Fetch dish details (ingredients) for display ───
    const [dishDetails, setDishDetails] = useState<Map<number, DishDetail>>(new Map());

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
                const newCategory = await apiClient.post<DietCategory>('/api/diets/', {
                    body: { name: newCategoryName },
                });
                setDietCategories([...dietCategories, newCategory]);
                setSelectedCategoryId(newCategory.id);
                setNewCategoryName('');
                setSelectOpen(false); // close dropdown so it refreshes on reopen
                message.success('套餐类别已创建');
            } catch (err) {
                console.error('Failed to create diet:', err);
                message.error('创建套餐类别失败');
            }
        }
    };

    // ─── Rename diet category ───
    const handleRenameDiet = (diet: DietCategory) => {
        let newName = diet.name;
        Modal.confirm({
            title: '重命名套餐类别',
            content: (
                <Input
                    defaultValue={diet.name}
                    onChange={(e) => { newName = e.target.value; }}
                    placeholder="输入新名称"
                />
            ),
            okText: '保存',
            cancelText: '取消',
            onOk: async () => {
                if (!newName || newName === diet.name) return;
                try {
                    await apiClient.put<DietCategory>(`/api/diets/${diet.id}/`, {
                        body: { name: newName },
                    });
                    message.success('套餐类别已重命名');
                    fetchDiets();
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
            await apiClient.delete(`/api/diets/${dietId}/`);
            message.success('套餐类别已删除');
            const remaining = dietCategories.filter((c) => c.id !== dietId);
            setDietCategories(remaining);
            if (selectedCategoryId === dietId) {
                setSelectedCategoryId(remaining.length > 0 ? remaining[0].id : 0);
            }
        } catch (err) {
            console.error('Failed to delete diet:', err);
            message.error('删除失败');
        }
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
            message.success('菜单已保存');
            setIsModalVisible(false);
            fetchMenus(); // refresh from API
        } catch (err) {
            console.error('Failed to save weekly menu:', err);
            message.error('保存菜单失败');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const renderMealSection = (title: string, dishes: DishItem[]) => (
        <div className="mb-3">
            <Text
                strong
                className="print-meal-title mb-1 block"
                style={{ color: '#1890ff' }}
            >
                {title}
            </Text>
            {dishes.length === 0 ? (
                <Text type="secondary" italic>
                    无
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
                                                const grams = Math.round(parseFloat(ing.net_quantity) * 1000);
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
                                编辑
                            </Button>
                        }
                        className="print-card h-full"
                        styles={{ body: { padding: '12px' } }}
                    >
                        {renderMealSection('早餐', day.breakfast)}
                        <Divider className="print-divider !my-2" />
                        {renderMealSection('午餐', day.lunch)}
                        <Divider className="print-divider !my-2" />
                        {renderMealSection('晚餐', day.dinner)}
                    </Card>
                </Col>
            ))}
        </Row>
    );

    return (
        <div>
            <div className="no-print mb-6 flex items-center justify-between">
                <Title level={2} className="!m-0">
                    标准菜谱安排 (Standard Cycle Menu)
                </Title>
                <Space>
                    <Select
                        value={selectedCategoryId}
                        style={{ width: 280 }}
                        open={selectOpen}
                        onDropdownVisibleChange={setSelectOpen}
                        onChange={(val) => { setSelectedCategoryId(val); setSelectOpen(false); }}
                        options={dietCategories.map((c) => ({
                            label: c.name,
                            value: c.id,
                        }))}
                        optionRender={(option) => {
                            const diet = dietCategories.find((c) => c.id === option.value);
                            if (!diet) return option.label;
                            return (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider className="!my-2" />
                                <Space className="px-2 pb-1">
                                    <Input
                                        placeholder="新套餐名称"
                                        ref={inputRef}
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        style={{ width: 150 }}
                                    />
                                    <Button
                                        type="text"
                                        icon={<PlusOutlined />}
                                        onClick={addDietCategory}
                                    >
                                        添加
                                    </Button>
                                </Space>
                            </>
                        )}
                    />
                    <Button onClick={handlePrint}>导出 PDF / 打印</Button>
                </Space>
            </div>

            {/* Print Header */}
            <div className="print-only mb-5 hidden text-center">
                <Title level={2} className="!m-0">
                    标准菜谱
                </Title>
                <Title level={3} className="!my-2">
                    {dietCategories.find((c) => c.id === selectedCategoryId)?.name ??
                        '未知套餐'}
                    配料表
                </Title>
            </div>

            <Spin spinning={loading}>
                {renderDayCards(dayPlans)}
            </Spin>

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
