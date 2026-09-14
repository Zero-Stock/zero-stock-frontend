import { useEffect, useMemo } from 'react';
import {
  Form,
  Input,
  Modal,
  Button,
  Row,
  Col,
  InputNumber,
  Select,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type {
  DishPreviewSchema,
  DishUpsertSchema,
  MaterialPreviewSchema,
} from '@/shared/types/schema';
import { useMaterialList } from '@/modules/material/hooks/useMaterialList';

const { TextArea } = Input;

interface DishEditModalProps {
  visible: boolean;
  record: DishPreviewSchema | null;
  onCancel: () => void;
  onSave: (values: DishUpsertSchema) => void;
}

export default function DishEditModal({
  visible,
  record,
  onCancel,
  onSave,
}: DishEditModalProps) {
  const [form] = Form.useForm<DishUpsertSchema>();
  const { materials, isLoading: isLoadingMaterials } = useMaterialList({
    page_size: 10000,
  });

  const materialOptions = useMemo(() => {
    return materials.map((material) => ({
      label: material.name,
      value: material.id,
    }));
  }, [materials]);

  const processingOptionsByMaterialId = useMemo(() => {
    return new Map(
      materials.map((material: MaterialPreviewSchema) => [
        material.id,
        material.processing.map((method) => ({
          label: method.name,
          value: method.id,
        })),
      ]),
    );
  }, [materials]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (record) {
      form.setFieldsValue({
        name: record.name,
        seasonings: record.seasonings,
        cooking_method: record.cooking_method,
        ingredients: record.ingredients.map((ingredient) => ({
          material_id: ingredient.material_id,
          processing_method_id: ingredient.processing_method_id,
          net_quantity: ingredient.net_quantity,
        })),
      });
    } else {
      form.resetFields();
    }
  }, [visible, record, form]);

  const handleOk = () => {
    form.validateFields().then((values: DishUpsertSchema) => {
      const payload: DishUpsertSchema = {
        name: values.name,
        seasonings: values.seasonings,
        cooking_method: values.cooking_method,
        ingredients: (values.ingredients || []).map((ingredient) => {
          const materialId = ingredient.material_id ?? 0;

          return {
            material_id: materialId,
            processing_method_id: ingredient.processing_method_id ?? null,
            net_quantity: ingredient.net_quantity ?? '0',
          };
        }),
      };

      onSave(payload);
    });
  };

  return (
    <Modal
      title={record ? '编辑菜品' : '新建菜品'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
      width={700}
      okText={'保存'}
      cancelText={'取消'}
      forceRender
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={'菜品名'}
          rules={[{ required: true, message: '请输入菜品名' }]}
        >
          <Input placeholder={'例如：西红柿打卤面'} />
        </Form.Item>

        <div className="mb-2 font-semibold">{'食材'}</div>
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={8} className="mb-2">
                  <Col span={7}>
                    <Form.Item
                      {...restField}
                      name={[name, 'material_id']}
                      rules={[
                        {
                          required: true,
                          message: '选择食材',
                        },
                      ]}
                      className="m-0!"
                    >
                      <Select
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder={'选择食材'}
                        options={materialOptions}
                        loading={isLoadingMaterials}
                        onChange={() => {
                          form.setFieldValue(
                            ['ingredients', name, 'processing_method_id'],
                            undefined,
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, next) =>
                        prev.ingredients?.[name]?.material_id !==
                        next.ingredients?.[name]?.material_id
                      }
                    >
                      {({ getFieldValue }) => {
                        const materialId = getFieldValue([
                          'ingredients',
                          name,
                          'material_id',
                        ]);
                        const processingOptions =
                          processingOptionsByMaterialId.get(materialId) ?? [];

                        return (
                          <Form.Item
                            {...restField}
                            name={[name, 'processing_method_id']}
                            className="m-0!"
                          >
                            <Select
                              showSearch={{ optionFilterProp: 'label' }}
                              allowClear
                              placeholder={'加工方式'}
                              options={processingOptions}
                              disabled={!materialId}
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      {...restField}
                      name={[name, 'net_quantity']}
                      rules={[
                        {
                          required: true,
                          message: '输入克重',
                        },
                      ]}
                      className="m-0!"
                    >
                      <InputNumber
                        stringMode
                        min={1}
                        placeholder={'重量(g)'}
                        className="w-full!"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                      className="w-full!"
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
                  {'添加食材'}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div className="mb-2 font-semibold">{'调料'}</div>
        <Form.Item
          name="seasonings"
          rules={[{ required: true, message: '请填写调料' }]}
        >
          <TextArea
            placeholder={'盐2g, 糖1g'}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <div className="mb-2 font-semibold">{'具体制作工艺'}</div>
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
