import { Button, Form, Input, Typography, message } from 'antd';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useSupplierCreate } from '../hooks/useSupplierCreate';
import { useSupplierMaterialCreate } from '../hooks/useSupplierMaterialCreate';
import type { SupplierCreateDto } from '../dtos/supplierCreate.dto';
import { useTranslation } from '@/shared/i18n/LanguageContext';
import SupplierCreateMaterialTable from './SupplierCreateMaterialTable';

const { Title, Text } = Typography;

type FormValues = {
  name: string;
  contact_person: string;
  phone: string;
  address: string;
  materials: Array<{
    rawMaterialId?: number;
    price?: number;
    unit?: string;
    kg_per_unit?: number;
  }>;
};

export default function SupplierCreateForm() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trigger: createSupplier } = useSupplierCreate();
  const { trigger: createMaterial } = useSupplierMaterialCreate();

  const onFinish = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload: SupplierCreateDto = {
        name: values.name,
        contact_person: values.contact_person,
        phone: values.phone,
        address: values.address,
      };

      const createdSupplier = await createSupplier(payload);
      const supplierId =
        (createdSupplier as any).results?.id || (createdSupplier as any).id;

      if (!supplierId) {
        message.error(t('supplierCreateErrorId'));
        return;
      }

      // Create materials if any
      const mRows = values.materials || [];
      for (const row of mRows) {
        if (row.rawMaterialId) {
          try {
            await createMaterial({
              supplier: supplierId,
              raw_material: row.rawMaterialId,
              unit_name: row.unit || 'kg',
              kg_per_unit: String(row.kg_per_unit || 1),
              price: String(row.price || 0),
            });
          } catch (err) {
            console.error(err);
            message.warning(
              `${t('supplierCreateErrorMaterial')} ${row.rawMaterialId}`,
            );
          }
        }
      }

      message.success(t('supplierCreated'));
      navigate(`/supplier/${supplierId}`);
    } catch (err) {
      console.error(err);
      message.error(t('supplierCreateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        materials: [
          {
            rawMaterialId: undefined,
            price: undefined,
            unit: '',
            kg_per_unit: undefined,
          },
        ],
      }}
    >
      <Title level={4}>{t('supplierBasicInfo')}</Title>

      <div className="grid w-full grid-cols-4 gap-4">
        <Form.Item
          label={t('supplierNameLabel')}
          name="name"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input placeholder={t('supplierNamePlaceholder')} />
        </Form.Item>

        <Form.Item label={t('supplierContactLabel')} name="contact_person">
          <Input placeholder={t('supplierContactPlaceholder')} />
        </Form.Item>

        <Form.Item label={t('supplierPhoneLabel')} name="phone">
          <Input placeholder={t('supplierPhonePlaceholder')} />
        </Form.Item>

        <Form.Item label={t('supplierAddressLabel')} name="address">
          <Input placeholder={t('supplierAddressPlaceholder')} />
        </Form.Item>
      </div>

      <div className="mt-6">
        <Title level={4} className="mb-1">
          {t('supplierMaterialDetails')}
        </Title>
        <Text type="secondary">{t('supplierMaterialDetailsDesc')}</Text>

        <div className="mt-4 max-w-[1100px]">
          <SupplierCreateMaterialTable />
        </div>
      </div>

      <div className="mt-6 flex w-full justify-end gap-3">
        <Button
          onClick={() => {
            navigate('/supplier');
          }}
          disabled={isSubmitting}
        >
          {t('cancel')}
        </Button>

        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {t('save')}
        </Button>
      </div>
    </Form>
  );
}
