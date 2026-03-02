import { useEffect, useState, useCallback } from 'react';
import { Form, Input, Modal, Button, Row, Col, InputNumber, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { Dish, DishFormValues, DishFormIngredient, PaginatedResponse } from '../mockdata';
import { dishToFormValues } from '../apiAdapter';
import { apiClient } from '@/shared/api/apiClient.client';

const { TextArea } = Input;

// ─── Types for material API responses ───

interface ProcessedMaterial {
    id: number;
    method_name: string;
    yield_rate: string;
}

interface RawMaterial {
    id: number;
    name: string;
    category: number | null;
    category_name: string | null;
    specs: ProcessedMaterial[];  // processing methods for this material
}

interface MaterialCategory {
    id: number;
    name: string;
}

interface DishEditModalProps {
    visible: boolean;
    record: Dish | null;
    onCancel: () => void;
    onSave: (values: DishFormValues & { id: number }) => void;
}

export default function DishEditModal({
    visible,
    record,
    onCancel,
    onSave,
}: DishEditModalProps) {
    const [form] = Form.useForm();
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [categories, setCategories] = useState<MaterialCategory[]>([]);

    // ─── Fetch materials and categories from API ───
    const fetchMaterials = useCallback(async () => {
        try {
            const data = await apiClient.get<PaginatedResponse<RawMaterial>>(
                '/api/materials/',
                { query: { page_size: 500 } },
            );
            setMaterials(data.results);
        } catch (err) {
            console.error('Failed to fetch materials:', err);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await apiClient.get<MaterialCategory[]>(
                '/api/material-categories/',
            );
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    }, []);

    useEffect(() => {
        if (visible) {
            fetchMaterials();
            fetchCategories();
        }
    }, [visible, fetchMaterials, fetchCategories]);

    useEffect(() => {
        if (visible && record) {
            form.setFieldsValue(dishToFormValues(record));
        } else if (visible && !record) {
            form.resetFields();
        }
    }, [visible, record, form]);

    // Get processing options for a selected material
    const getProcessingOptions = (materialId: number | undefined) => {
        if (!materialId) return [];
        const mat = materials.find((m) => m.id === materialId);
        if (!mat) return [];
        return mat.specs.map((s) => ({
            label: s.method_name,
            value: s.id,
        }));
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const structuredIngredients = (values.ingredients || []).map(
                (ing: DishFormIngredient) => {
                    // Look up display names from materials
                    const mat = materials.find((m) => m.id === ing.raw_material_id);
                    const spec = mat?.specs.find((s) => s.id === ing.processing_id);
                    return {
                        ...ing,
                        material: mat?.name ?? ing.material ?? '',
                        processing: spec?.method_name ?? ing.processing ?? '',
                        category: mat?.category_name ?? ing.category ?? '',
                        id: ing.id || Date.now() + Math.floor(Math.random() * 1000),
                    };
                },
            );

            onSave({
                ...values,
                ingredients: structuredIngredients,
                id: record?.id || Date.now(),
            });
            form.resetFields();
        });
    };

    return (
        <Modal
            title={record ? '编辑菜品' : '新建菜品'}
            open={visible}
            onOk={handleOk}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            width={700}
            okText="保存"
            cancelText="取消"
            forceRender
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="菜品名"
                    rules={[{ required: true, message: '请输入菜品名' }]}
                >
                    <Input placeholder="例如：西红柿打卤面" />
                </Form.Item>

                <div className="mb-2 font-semibold">食材物料</div>
                {materials.length === 0 && (
                    <div className="mb-2 text-amber-500 text-sm">
                        ⚠ 暂无原料数据，请先在原料管理页面添加原料
                    </div>
                )}
                <Form.List name="ingredients">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row
                                    key={key}
                                    gutter={8}
                                    className="mb-2"
                                >
                                    {/* Hidden fields to carry IDs */}
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'id']}
                                        hidden
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Col span={7}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'raw_material_id']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '选择原料',
                                                },
                                            ]}
                                            className="!m-0"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="选择原料"
                                                optionFilterProp="label"
                                                options={materials.map((m) => ({
                                                    label: `${m.name}${m.category_name ? ` (${m.category_name})` : ''}`,
                                                    value: m.id,
                                                }))}
                                                onChange={() => {
                                                    // Clear processing when material changes
                                                    const ingredients = form.getFieldValue('ingredients');
                                                    if (ingredients?.[name]) {
                                                        ingredients[name].processing_id = undefined;
                                                        form.setFieldsValue({ ingredients });
                                                    }
                                                }}
                                                notFoundContent={
                                                    <div className="p-2 text-center text-gray-400">
                                                        无原料数据
                                                    </div>
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'processing_id']}
                                            className="!m-0"
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                placeholder="加工方式"
                                                optionFilterProp="label"
                                                options={getProcessingOptions(
                                                    form.getFieldValue([
                                                        'ingredients',
                                                        name,
                                                        'raw_material_id',
                                                    ]),
                                                )}
                                                notFoundContent={
                                                    <div className="p-2 text-center text-gray-400">
                                                        无加工规格
                                                    </div>
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '输入克重',
                                                },
                                            ]}
                                            className="!m-0"
                                        >
                                            <InputNumber
                                                min={1}
                                                placeholder="重量(g)"
                                                className="!w-full"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => remove(name)}
                                            className="!w-full"
                                            tabIndex={-1}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    添加食材
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <div className="mb-2 font-semibold">调料 (g)</div>
                <Form.Item
                    name="seasonings"
                    rules={[{ required: true, message: '请填写调料' }]}
                >
                    <TextArea
                        placeholder="盐2g, 糖1g"
                        autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                </Form.Item>

                <div className="mb-2 font-semibold">具体制作工艺</div>
                <Form.Item
                    name="cooking_method"
                    rules={[{ required: true, message: '请填写制作工艺' }]}
                >
                    <TextArea
                        placeholder={'1. 去皮前膀加盐煎至两面金黄\n2. 炒西红柿'}
                        autoSize={{ minRows: 4, maxRows: 8 }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
