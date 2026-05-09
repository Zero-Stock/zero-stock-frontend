import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from '@/shared/translation/LanguageContext';
import type {
  SupplierMaterialPreviewSchema,
  SupplierMaterialUpsertSchema,
} from '@/shared/types/schema';
import useMaterialOptions from '@/modules/material/hooks/useMaterialOptions';
import { gramsToKg, kgToGrams } from '../utils/supplierMaterialUnit';

export interface SupplierMaterialUpsertModalProps {
  open: boolean;
  initialValues?: SupplierMaterialPreviewSchema | null;
  existingRawMaterialIds: Set<number>;
  onCancel: () => void;
  onSave: (
    payload: Omit<SupplierMaterialUpsertSchema, 'supplier_id'> & {
      id?: SupplierMaterialUpsertSchema['id'];
    },
  ) => void;
}

type SupplierMaterialFormValues = Omit<
  SupplierMaterialUpsertSchema,
  'supplier_id' | 'g_per_unit' | 'price_per_unit'
> & {
  g_per_unit?: string;
  price_per_unit?: string;
};

export default function SupplierMaterialUpsertModal({
  open,
  initialValues,
  existingRawMaterialIds,
  onCancel,
  onSave,
}: SupplierMaterialUpsertModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<SupplierMaterialFormValues>();

  const { materialOptions, isLoading } = useMaterialOptions();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          g_per_unit: gramsToKg(initialValues.g_per_unit),
          price_per_unit: initialValues.price_per_unit ?? undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    const v = await form.validateFields();

    const materialId = Number(v.material_id);

    // 同一供应商不能重复添加同一原料（后端规则），仅在新建时校验
    if (!initialValues && existingRawMaterialIds.has(materialId)) {
      form.setFields([
        {
          name: 'material_id',
          errors: [t('supplierMaterialDuplicateError')],
        },
      ]);
      return;
    }

    const payload: Omit<SupplierMaterialUpsertSchema, 'supplier_id'> & {
      id?: SupplierMaterialUpsertSchema['id'];
    } = {
      material_id: materialId,
      unit_name: v.unit_name,
      g_per_unit: kgToGrams(v.g_per_unit) ?? '0',
      price_per_unit: v.price_per_unit ?? null,
      notes: v.notes,
    };

    if (initialValues) {
      payload.id = initialValues.id;
    }

    onSave(payload);
  };

  return (
    <Modal
      title={
        initialValues
          ? t('supplierEditMaterialTitle')
          : t('supplierAddMaterialTitle')
      }
      open={open}
      okText={t('save')}
      cancelText={t('cancel')}
      destroyOnHidden
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t('commonName')}
          name="material_id"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Select
            allowClear
            showSearch
            placeholder={t('commonSelectMaterial')}
            loading={isLoading}
            options={materialOptions}
            disabled={!!initialValues}
          />
        </Form.Item>

        <Form.Item
          label={t('commonUnit')}
          name="unit_name"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input placeholder={t('supplierUnitPlaceholderKg')} />
        </Form.Item>

        <Form.Item
          label={t('supplierKgPerUnit')}
          name="g_per_unit"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <InputNumber
            stringMode
            style={{ width: '100%' }}
            min={0}
            step="0.01"
            suffix="kg"
            placeholder={t('supplierKgPlaceholder')}
          />
        </Form.Item>

        <Form.Item
          label={t('supplierPrice')}
          name="price_per_unit"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <InputNumber
            stringMode
            min={0}
            step="0.01"
            suffix="¥"
            placeholder={t('supplierPricePlaceholder')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label={t('supplierMaterialNotes')} name="notes">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
