import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';
import type {
  StaplePreviewSchema,
  StapleUpsertSchema,
} from '@/shared/types/schema';
import { useTranslation } from '@/shared/translation/LanguageContext';

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
  const { t } = useTranslation();

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
      title={record ? t('stapleEditTitle') : t('stapleCreate')}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
      confirmLoading={confirmLoading}
      okText={t('save')}
      cancelText={t('cancel')}
      forceRender
    >
      <Form form={form} layout="vertical">
        <Form.Item<StapleUpsertSchema>
          name="name"
          label={t('commonName')}
          rules={[{ required: true, message: t('stapleNameRequired') }]}
        >
          <Input placeholder={t('stapleNamePlaceholder')} />
        </Form.Item>

        <Form.Item<StapleUpsertSchema>
          name="unit_name"
          label={t('commonUnit')}
          rules={[{ required: true, message: t('stapleUnitRequired') }]}
        >
          <Input placeholder={t('stapleUnitPlaceholder')} />
        </Form.Item>

        <Form.Item<StapleUpsertSchema>
          name="g_per_unit"
          label={t('stapleGramsPerUnit')}
          rules={[
            { required: true, message: t('stapleGramsPerUnitRequired') },
          ]}
        >
          <InputNumber
            stringMode
            min={0}
            step="1"
            className="w-full!"
            placeholder={t('stapleGramsPerUnitPlaceholder')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
