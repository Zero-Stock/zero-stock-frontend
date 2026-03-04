import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';
import type { SupplierUpdateDto } from '../dtos/supplierUpdate.dto';
import { useTranslation } from '@/shared/i18n/LanguageContext';

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
      title={t('supplierEdit')}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t('save')}
      cancelText={t('cancel')}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item label={t('supplierColId')} name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t('supplierColName')}
          name="name"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('supplierColContact')}
          name="contact_person"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('supplierColPhone')}
          name="phone"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('supplierColAddress')}
          name="address"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
