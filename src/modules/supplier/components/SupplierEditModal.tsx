import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';
import type { SupplierUpsertSchema } from '@/shared/types/schema';
import { useTranslation } from '@/shared/translation/LanguageContext';

interface SupplierEditModalProps {
  open: boolean;
  supplier:
    | (SupplierUpsertSchema & Required<Pick<SupplierUpsertSchema, 'id'>>)
    | null;
  onCancel: () => void;
  onSave: (
    updated: SupplierUpsertSchema & Required<Pick<SupplierUpsertSchema, 'id'>>,
  ) => void;
}

export default function SupplierEditModal({
  open,
  supplier,
  onCancel,
  onSave,
}: SupplierEditModalProps) {
  const { t } = useTranslation();
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
    const updated: SupplierUpsertSchema &
      Required<Pick<SupplierUpsertSchema, 'id'>> = {
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
      title={t('supplierEdit')}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t('save')}
      cancelText={t('cancel')}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item label={t('commonId')} name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t('commonName')}
          name="name"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('commonContactPerson')}
          name="contact_person"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('commonPhone')}
          name="phone"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('commonAddress')}
          name="address"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
