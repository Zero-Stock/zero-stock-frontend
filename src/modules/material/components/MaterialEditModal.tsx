import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { type RawMaterial } from '../mockdata';

const { Option } = Select;

interface MaterialEditModalProps {
  visible: boolean;
  record: RawMaterial | null;
  onCancel: () => void;
  onSave: (values: RawMaterial) => void;
}

export default function MaterialEditModal({
  visible,
  record,
  onCancel,
  onSave,
}: MaterialEditModalProps) {
  const [form] = Form.useForm();
  const categories = ['冻品', '粮油', '肉类', '蔬菜'];

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue(record);
    }
  }, [visible, record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...record, ...values });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Edit Raw Material"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="id" label="ID">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input name' }]}
        >
          <Input placeholder="Input raw material name" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select placeholder="Select category">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="unit"
          label="Unit"
          rules={[{ required: true, message: 'Please input unit' }]}
        >
          <Input placeholder="e.g. {箱: 10kg}" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
