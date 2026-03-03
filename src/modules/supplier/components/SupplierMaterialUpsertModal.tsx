import { Modal, Form, Input, InputNumber } from 'antd';
import type { SupplierMaterialCreateDto } from '../dtos/supplierMaterialCreate.dto';

export default function SupplierMaterialUpsertModal({
  open,
  existingRawMaterialIds,
  onCancel,
  onSave,
}: {
  open: boolean;
  existingRawMaterialIds: Set<number>;
  onCancel: () => void;
  onSave: (payload: SupplierMaterialCreateDto) => void;
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add Supplier Material"
      open={open}
      okText="Save"
      cancelText="Cancel"
      destroyOnClose
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={async () => {
        const v = await form.validateFields();

        const rawId = Number(v.raw_material);
        if (existingRawMaterialIds.has(rawId)) {
          // 同一供应商不能重复添加同一原料（后端规则）
          form.setFields([
            {
              name: 'raw_material',
              errors: ['This raw material already exists for this supplier.'],
            },
          ]);
          return;
        }

        const payload: SupplierMaterialCreateDto = {
          raw_material: rawId,
          unit_name: v.unit_name,
          kg_per_unit: String(v.kg_per_unit),
          price: String(v.price),
          notes: v.notes,
        };
        onSave(payload);
        form.resetFields();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Raw Material ID"
          name="raw_material"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item
          label="Unit Name"
          name="unit_name"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g. 箱 / 袋 / kg" />
        </Form.Item>

        <Form.Item
          label="kg per Unit"
          name="kg_per_unit"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
        </Form.Item>

        <Form.Item
          label="Price per Unit"
          name="price"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
