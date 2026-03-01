import { useEffect } from 'react';
<<<<<<< HEAD
import { Modal, Form, Button, InputNumber, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { DayPlan, DishItem } from '../mockdata';
import type { Dish } from '@/modules/dish/mockdata';
import { useTranslation } from '@/shared/i18n/LanguageContext';
=======
import { Modal, Form, Input, Button, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { DayPlan, DishItem } from '../mockdata';
>>>>>>> 1baf30c (init meal module)

interface MealEditModalProps {
    visible: boolean;
    dayData: DayPlan | null;
    onCancel: () => void;
    onSave: (updatedDay: DayPlan) => void;
<<<<<<< HEAD
    availableDishes: Dish[];
=======
>>>>>>> 1baf30c (init meal module)
}

export default function MealEditModal({
    visible,
    dayData,
    onCancel,
    onSave,
<<<<<<< HEAD
    availableDishes,
}: MealEditModalProps) {
    const [form] = Form.useForm();
    const { t } = useTranslation();
=======
}: MealEditModalProps) {
    const [form] = Form.useForm();
>>>>>>> 1baf30c (init meal module)

    useEffect(() => {
        if (visible && dayData) {
            const withCount = (dishes: DishItem[]) =>
                dishes.map((d) => ({ ...d, count: d.count ?? 1 }));
            form.setFieldsValue({
                breakfast: withCount(dayData.breakfast),
                lunch: withCount(dayData.lunch),
                dinner: withCount(dayData.dinner),
            });
        }
    }, [visible, dayData, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (dayData) {
<<<<<<< HEAD
                const assignIds = (dishes: any[] | undefined) => {
                    return (dishes || []).map((dish) => {
                        const targetDish = availableDishes.find((d) => d.id === dish.id);
                        return {
                            ...dish,
                            count: dish.count ?? 1,
                            id: dish.id,
                            name: targetDish ? targetDish.name : '未知菜品',
                        };
                    });
=======
                const assignIds = (dishes: DishItem[] | undefined) => {
                    return (dishes || []).map((dish) => ({
                        ...dish,
                        count: dish.count ?? 1,
                        // If no backend ID yet, assign a temporary negative ID
                        id: dish.id ?? -(Date.now() + Math.floor(Math.random() * 10000)),
                    }));
>>>>>>> 1baf30c (init meal module)
                };

                onSave({
                    dayOfWeek: dayData.dayOfWeek,
                    dayNumber: dayData.dayNumber,
                    breakfast: assignIds(values.breakfast),
                    lunch: assignIds(values.lunch),
                    dinner: assignIds(values.dinner),
                });
            }
        });
    };

    const renderDishList = (name: string, label: string) => (
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <h3 className="mt-0 text-base font-semibold">{label}</h3>
            <Form.List name={name}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name: fieldName, ...restField }) => (
                            <div
                                key={key}
                                className="mb-2 flex items-center gap-2"
                            >
                                {/* Dish name – takes remaining space */}
                                <Form.Item
                                    {...restField}
<<<<<<< HEAD
                                    name={[fieldName, 'id']}
                                    rules={[{ required: true, message: t('mealSelectDishRequired') }]}
                                    className="!m-0 min-w-0 flex-1"
                                >
                                    <Select
                                        showSearch
                                        placeholder={t('mealSelectDish')}
                                        optionFilterProp="label"
                                        options={availableDishes.map((d) => ({
                                            label: d.name,
                                            value: d.id,
                                        }))}
                                        notFoundContent={t('mealNoDishes')}
                                    />
=======
                                    name={[fieldName, 'name']}
                                    rules={[{ required: true, message: '请输入菜品名' }]}
                                    className="!m-0 min-w-0 flex-1"
                                >
                                    <Input placeholder="菜品名 (如: 西红柿打卤面)" />
>>>>>>> 1baf30c (init meal module)
                                </Form.Item>

                                {/* 'x' label + spinner, pushed right */}
                                <span className="shrink-0 text-sm text-gray-500">x</span>
                                <Form.Item
                                    {...restField}
                                    name={[fieldName, 'count']}
                                    className="!m-0 shrink-0"
                                    initialValue={1}
                                >
                                    <InputNumber
                                        mode="spinner"
                                        min={1}
                                        max={99}
                                        style={{ width: 120 }}
                                    />
                                </Form.Item>

                                <MinusCircleOutlined
                                    onClick={() => remove(fieldName)}
                                    className="shrink-0 cursor-pointer text-base text-red-500"
                                />
                            </div>
                        ))}
                        <Form.Item className="!m-0 mt-2">
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                            >
<<<<<<< HEAD
                                {t('mealAddDish')}
=======
                                添加菜品
>>>>>>> 1baf30c (init meal module)
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </div>
    );

    return (
        <Modal
<<<<<<< HEAD
            title={dayData ? t('mealEditTitle', { day: dayData.dayOfWeek }) : t('mealEditTitleGeneric')}
=======
            title={dayData ? `编辑 ${dayData.dayOfWeek} 食谱` : '编辑食谱'}
>>>>>>> 1baf30c (init meal module)
            open={visible}
            onOk={handleOk}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            width={600}
<<<<<<< HEAD
            okText={t('save')}
            cancelText={t('cancel')}
            forceRender
        >
            <Form form={form} layout="vertical">
                {renderDishList('breakfast', t('mealBreakfast'))}
                {renderDishList('lunch', t('mealLunch'))}
                {renderDishList('dinner', t('mealDinner'))}
=======
            okText="保存"
            cancelText="取消"
            forceRender
        >
            <Form form={form} layout="vertical">
                {renderDishList('breakfast', '早餐')}
                {renderDishList('lunch', '午餐')}
                {renderDishList('dinner', '晚餐')}
>>>>>>> 1baf30c (init meal module)
            </Form>
        </Modal>
    );
}
