import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import type { SupplierMaterialDto } from '../dtos/supplierMaterial.dto';
import { useMaterialList } from '@/modules/material/hooks/useMaterialList';
import { useTranslation } from '@/shared/translation/LanguageContext';

export interface SupplierMaterialUpsertModalProps {
  open: boolean;
  initialValues?: SupplierMaterialDto | null;
  existingRawMaterialIds: Set<number>;
  onCancel: () => void;
  onSave: (payload: any) => void;
}

export default function SupplierMaterialUpsertModal({
  open,
  initialValues,
  existingRawMaterialIds,
  onCancel,
  onSave,
}: SupplierMaterialUpsertModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // optionally pass page_size: 1000 or similar to fetch all materials, depending on backend pagination
  const { materialOptions, isLoading } = useMaterialList({ page_size: 1000 });

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    const v = await form.validateFields();

    const rawId = Number(v.raw_material);

    // 同一供应商不能重复添加同一原料（后端规则），仅在新建时校验
    if (!initialValues && existingRawMaterialIds.has(rawId)) {
      form.setFields([
        {
          name: 'raw_material',
          errors: [t('supplierMaterialDuplicateError')],
        },
      ]);
      return;
    }

    const payload: any = {
      raw_material: rawId,
      unit_name: v.unit_name,
      kg_per_unit: String(v.kg_per_unit),
      price: v.price ? String(v.price) : null,
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
          name="raw_material"
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
          name="kg_per_unit"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={0.01}
            placeholder={t('supplierKgPlaceholder')}
          />
        </Form.Item>

        <Form.Item
          label={t('supplierPrice')}
          name="price"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={0.01}
            placeholder={t('supplierPricePlaceholder')}
          />
        </Form.Item>

        <Form.Item label={t('supplierMaterialNotes')} name="notes">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
