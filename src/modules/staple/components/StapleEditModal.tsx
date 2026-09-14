import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';
import type {
  StaplePreviewSchema,
  StapleUpsertSchema,
} from '@/shared/types/schema';

interface StapleEditModalProps {
  visible: boolean;
  record: StaplePreviewSchema | null;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSave: (values: StapleUpsertSchema) => void;
}

export default function StapleEditModal({
  visible,
  record,
  confirmLoading,
  onCancel,
  onSave,
}: StapleEditModalProps) {
  const [form] = Form.useForm<StapleUpsertSchema>();

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (record) {
      form.setFieldsValue({
        name: record.name,
        unit_name: record.unit_name,
        g_per_unit: record.g_per_unit,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ unit_name: 'g' });
    }
  }, [visible, record, form]);

  const handleOk = async () => {
    const values = await form.validateFields();

    onSave({
      name: values.name.trim(),
      unit_name: values.unit_name?.trim() || undefined,
      g_per_unit: values.g_per_unit,
    });
  };

  return (
    <Modal
      title={record ? '编辑主食' : '新建主食'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
      confirmLoading={confirmLoading}
      okText={'保存'}
      cancelText={'取消'}
      forceRender
    >
      <Form form={form} layout="vertical">
        <Form.Item<StapleUpsertSchema>
          name="name"
          label={'名称'}
          rules={[{ required: true, message: '请输入主食名称' }]}
        >
          <Input placeholder={'例如：米饭'} />
        </Form.Item>

        <Form.Item<StapleUpsertSchema>
          name="unit_name"
          label={'单位'}
          rules={[{ required: true, message: '请输入单位' }]}
        >
          <Input placeholder={'例如：碗、份、g'} />
        </Form.Item>

        <Form.Item<StapleUpsertSchema>
          name="g_per_unit"
          label={'每单位克重'}
          rules={[{ required: true, message: '请输入每单位克重' }]}
        >
          <InputNumber
            stringMode
            min={0}
            step="1"
            className="w-full!"
            placeholder={'例如：180'}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
