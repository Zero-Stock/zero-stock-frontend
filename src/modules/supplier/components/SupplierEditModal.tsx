import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';
import type { Supplier } from '../mockdata';

interface SupplierEditModalProps {
  open: boolean;
  supplier: Supplier | null;
  onCancel: () => void;
  onSave: (updatedSupplier: Supplier) => void;
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
      form.setFieldsValue({
        id: supplier.id,
        name: supplier.name,
        contact: supplier.contact,
        address: supplier.address,
      });
    }
  }, [supplier, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const updatedSupplier: Supplier = {
        ...supplier!,
        ...values,
      };

      onSave(updatedSupplier);
      form.resetFields();
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Edit Supplier"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="ID" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter supplier name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contact"
          name="contact"
          rules={[{ required: true, message: 'Please enter contact number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
