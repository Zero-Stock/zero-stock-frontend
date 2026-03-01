import {
    Button,
    Card,
    Col,
    Divider,
    Input,
    Row,
    Select,
    Space,
    Typography,
} from 'antd';
import type { InputRef } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
    mockDietCategories,
    mockWeeklyMenuRows,
    type DishItem,
    type DayPlan,
    type DietCategory,
    type DishDetail,
} from '../mockdata';
import { fetchDishDetails } from '../dishService';
import { rowsToDayPlans, dayPlanToBatchItems } from '../apiAdapter';
import MealEditModal from './MealEditModal';

const { Title, Text } = Typography;

const COMPANY_ID = 1; // TODO: get from auth context

export default function MealBoard() {
    const [dietCategories, setDietCategories] =
        useState<DietCategory[]>(mockDietCategories);
    const [newCategoryName, setNewCategoryName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
        mockDietCategories[0].id,
    );

    // In real usage this would come from GET /api/weekly-menus/?diet_category=X
    const [menuRows, setMenuRows] = useState(mockWeeklyMenuRows);

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

    const addDietCategory = (
        e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        if (
            newCategoryName &&
            !dietCategories.some((c) => c.name === newCategoryName)
        ) {
            // In real usage: POST /api/diets/ { name: newCategoryName }
            const newCategory = {
                id: Date.now(),
                name: newCategoryName,
            };
            setDietCategories([...dietCategories, newCategory]);
            setSelectedCategoryId(newCategory.id);
            setNewCategoryName('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDay, setEditingDay] = useState<DayPlan | null>(null);

    const handleEdit = (day: DayPlan) => {
        setEditingDay(day);
        setIsModalVisible(true);
    };

    const handleSave = (updatedDay: DayPlan) => {
        // Build the batch payload for POST /api/weekly-menus/batch/
        const batchItems = dayPlanToBatchItems(
            updatedDay,
            COMPANY_ID,
            selectedCategoryId,
        );
        console.log(
            'Would POST /api/weekly-menus/batch/ with:',
            JSON.stringify(batchItems, null, 2),
        );

        // Update local state (simulate API success)
        setMenuRows((prev) => {
            // Remove old rows for this day + diet_category
            const kept = prev.filter(
                (r) =>
                    !(
                        r.diet_category === selectedCategoryId &&
                        r.day_of_week === updatedDay.dayNumber
                    ),
            );
            // Add new rows
            const newRows = batchItems.map((item, idx) => ({
                id: Date.now() + idx,
                company: item.company,
                company_name: 'XX医院',
                diet_category: item.diet_category,
                diet_category_name:
                    dietCategories.find((c) => c.id === item.diet_category)?.name ?? '',
                day_of_week: item.day_of_week,
                day_display: '',
                meal_time: item.meal_time,
                meal_display: '',
                dishes: item.dishes,
                // For mock: we need to preserve the names
                dish_names: item.dishes.map((dishId) => {
                    // Look up name from the meal slots in updatedDay
                    const allDishes = [
                        ...updatedDay.breakfast,
                        ...updatedDay.lunch,
                        ...updatedDay.dinner,
                    ];
                    return allDishes.find((d) => d.id === dishId)?.name ?? `菜品#${dishId}`;
                }),
            }));
            return [...kept, ...newRows];
        });

        setIsModalVisible(false);
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
                        style={{ width: 200 }}
                        onChange={setSelectedCategoryId}
                        options={dietCategories.map((c) => ({
                            label: c.name,
                            value: c.id,
                        }))}
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
                                        style={{ width: 110 }}
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

            {renderDayCards(dayPlans)}

            <MealEditModal
                visible={isModalVisible}
                dayData={editingDay}
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
