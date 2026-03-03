import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';
import type { SupplierUpdateDto } from '../dtos/supplierUpdate.dto';

interface SupplierEditModalProps {
  open: boolean;
  supplier: SupplierUpdateDto | null; // ✅ 用 UpdateDto 统一
  onCancel: () => void;
  onSave: (updated: SupplierUpdateDto) => void;
}

export default function SupplierEditModal({
  open,
  supplier,
  onCancel,
  onSave,
}: SupplierEditModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
    } else {
      form.resetFields();
    }
  }, [supplier, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const updated: SupplierUpdateDto = {
      id: Number(values.id),
      name: values.name,
      contact_person: values.contact_person,
      phone: values.phone,
      address: values.address,
    };

    onSave(updated);
  };

  return (
    <Modal
      title="Edit Supplier"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item label="ID" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Contact Person"
          name="contact_person"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
