import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect, useMemo } from 'react';
import { mockRawMaterials } from '@/modules/material/mockdata';
import type { SupplierMaterialPrice } from '../mockdata';

export default function MaterialPriceEditModal({
  open,
  supplierId,
  existingRawMaterialIds,
  editing,
  onCancel,
  onSave,
}: {
  open: boolean;
  supplierId: string;
  existingRawMaterialIds: Set<string>;
  editing: SupplierMaterialPrice | null;
  onCancel: () => void;
  onSave: (next: SupplierMaterialPrice) => void;
}) {
  const [form] = Form.useForm();

  const rawMaterialOptions = useMemo(() => {
    return mockRawMaterials
      .filter((rm) => {
        // add 模式：过滤掉已存在的原材料；edit 模式：允许当前这个
        if (editing?.rawMaterialId === rm.id) return true;
        return !existingRawMaterialIds.has(rm.id);
      })
      .map((rm) => ({
        label: `${rm.id} - ${rm.name} (${rm.category})`,
        value: rm.id,
      }));
  }, [existingRawMaterialIds, editing]);

  const unitById = useMemo(() => {
    const m = new Map<string, string>();
    mockRawMaterials.forEach((rm) => m.set(rm.id, rm.unit));
    return m;
  }, []);

  useEffect(() => {
    if (!open) return;

    if (editing) {
      form.setFieldsValue({
        rawMaterialId: editing.rawMaterialId,
        price: editing.price,
        unit: editing.unit ?? '',
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        rawMaterialId: undefined,
        price: undefined,
        unit: '',
      });
    }
  }, [open, editing, form]);

  const onOk = async () => {
    const values = await form.validateFields();
    onSave({
      supplierId,
      rawMaterialId: values.rawMaterialId,
      price: Number(values.price ?? 0),
      unit: values.unit ?? '',
    });
  };

  return (
    <Modal
      title={editing ? 'Edit Material Price' : 'Add Material Price'}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="Save"
      cancelText="Cancel"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Raw Material"
          name="rawMaterialId"
          rules={[{ required: true, message: 'Please select raw material' }]}
        >
          <Select
            options={rawMaterialOptions}
            showSearch
            optionFilterProp="label"
            disabled={!!editing} // edit 时不允许改 rawMaterialId，避免变成“换行”
            onChange={(val) => {
              const currentUnit = form.getFieldValue('unit');
              if (!currentUnit) {
                form.setFieldValue('unit', unitById.get(val) ?? '');
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please input price' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            placeholder="e.g. 12.5"
          />
        </Form.Item>

        <Form.Item
          label="Unit (optional, default from raw material)"
          name="unit"
        >
          <Input placeholder="e.g. {箱: 10kg}" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
