import { useEffect } from 'react';
import { Modal, Form, Button, InputNumber, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { DayPlan, DishItem } from '../mockdata';
import type { Dish } from '@/modules/dish/mockdata';

interface MealEditModalProps {
    visible: boolean;
    dayData: DayPlan | null;
    onCancel: () => void;
    onSave: (updatedDay: DayPlan) => void;
    availableDishes: Dish[];
}

export default function MealEditModal({
    visible,
    dayData,
    onCancel,
    onSave,
    availableDishes,
}: MealEditModalProps) {
    const [form] = Form.useForm();

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
                                    name={[fieldName, 'id']}
                                    rules={[{ required: true, message: '请选择菜品' }]}
                                    className="!m-0 min-w-0 flex-1"
                                >
                                    <Select
                                        showSearch
                                        placeholder="选择菜品"
                                        optionFilterProp="label"
                                        options={availableDishes.map((d) => ({
                                            label: d.name,
                                            value: d.id,
                                        }))}
                                        notFoundContent="暂无菜品"
                                    />
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
                                添加菜品
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </div>
    );

    return (
        <Modal
            title={dayData ? `编辑 ${dayData.dayOfWeek} 食谱` : '编辑食谱'}
            open={visible}
            onOk={handleOk}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            width={600}
            okText="保存"
            cancelText="取消"
            forceRender
        >
            <Form form={form} layout="vertical">
                {renderDishList('breakfast', '早餐')}
                {renderDishList('lunch', '午餐')}
                {renderDishList('dinner', '晚餐')}
            </Form>
        </Modal>
    );
}
