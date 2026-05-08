import { useEffect } from 'react';
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
import { useDishMaterials } from '../hooks/useDishMaterials';
import { useTranslation } from '@/shared/translation/LanguageContext';

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
  const { t } = useTranslation();
  const { materials } = useDishMaterials(visible);

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
  }, [visible, record, materials, form]);

  // Get processing options for a selected material
  const getProcessingOptions = (materialId: number | undefined) => {
    if (!materialId) return [];
    const mat = materials.find(
      (m: MaterialPreviewSchema) => m.id === materialId,
    );
    if (!mat) return [];
    return mat.processing.map((method) => ({
      label: method.name,
      value: method.id,
    }));
  };

  const handleOk = () => {
    form.validateFields().then((values: DishUpsertSchema) => {
      const payload: DishUpsertSchema = {
        id: record?.id,
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
      title={record ? t('dishEditTitle') : t('dishCreate')}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
      width={700}
      okText={t('save')}
      cancelText={t('cancel')}
      forceRender
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={t('dishNameLabel')}
          rules={[{ required: true, message: t('dishNameRequired') }]}
        >
          <Input placeholder={t('dishNamePlaceholder')} />
        </Form.Item>

        <div className="mb-2 font-semibold">{t('dishIngredientLabel')}</div>
        {/* materials.length === 0 && (
                    <div className="mb-2 text-amber-500 text-sm">
                        {t('dishNoMaterial')}
                    </div>
                ) */}
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
                          message: t('commonSelectMaterial'),
                        },
                      ]}
                      className="!m-0"
                    >
                      <Select
                        showSearch
                        placeholder={t('commonSelectMaterial')}
                        optionFilterProp="label"
                        options={materials.map((m) => ({
                          label: `${m.name}${m.category_name ? ` (${m.category_name})` : ''}`,
                          value: m.id,
                        }))}
                        onChange={() => {
                          // Clear processing when material changes
                          const ingredients = form.getFieldValue('ingredients');
                          if (ingredients?.[name]) {
                            ingredients[name].processing_method_id = undefined;
                            form.setFieldsValue({ ingredients });
                          }
                        }}
                        notFoundContent={
                          <div className="p-2 text-center text-gray-400">
                            {t('dishNoMaterialData')}
                          </div>
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'processing_method_id']}
                      className="!m-0"
                    >
                      <Select
                        showSearch
                        allowClear
                        placeholder={t('dishSelectProcessing')}
                        optionFilterProp="label"
                        options={getProcessingOptions(
                          form.getFieldValue([
                            'ingredients',
                            name,
                            'material_id',
                          ]),
                        )}
                        notFoundContent={
                          <div className="p-2 text-center text-gray-400">
                            {t('dishNoProcessing')}
                          </div>
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      {...restField}
                      name={[name, 'net_quantity']}
                      rules={[
                        {
                          required: true,
                          message: t('dishWeightRequired'),
                        },
                      ]}
                      className="!m-0"
                    >
                      <InputNumber
                        stringMode
                        min={1}
                        placeholder={t('dishWeightPlaceholder')}
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
                  {t('dishAddIngredient')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div className="mb-2 font-semibold">{t('dishColSeasonings')}</div>
        <Form.Item
          name="seasonings"
          rules={[{ required: true, message: t('dishSeasoningsRequired') }]}
        >
          <TextArea
            placeholder={t('dishSeasoningsPlaceholder')}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <div className="mb-2 font-semibold">{t('dishColCookingMethod')}</div>
        <Form.Item
          name="cooking_method"
          rules={[{ required: true, message: t('dishCookingMethodRequired') }]}
        >
          <TextArea
            placeholder={t('dishCookingMethodPlaceholder')}
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
