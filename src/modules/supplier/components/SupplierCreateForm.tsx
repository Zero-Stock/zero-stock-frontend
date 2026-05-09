import { Button, Form, Input, Typography, message } from 'antd';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useSupplierCreate } from '../hooks/useSupplierCreate';
import { useSupplierMaterialCreate } from '../hooks/useSupplierMaterialCreate';
import { useTranslation } from '@/shared/translation/LanguageContext';
import SupplierCreateMaterialTable from './SupplierCreateMaterialTable';
import type {
  SupplierMaterialUpsertSchema,
  SupplierUpsertSchema,
} from '@/shared/types/schema';
import { kgToGrams } from '../utils/supplierMaterialUnit';

const { Title, Text } = Typography;

type SupplierCreateMaterialFormRow = {
  rawMaterialId?: SupplierMaterialUpsertSchema['material_id'];
  price_per_unit?: string;
  unit?: SupplierMaterialUpsertSchema['unit_name'];
  g_per_unit?: string;
};

type SupplierCreateFormValues = SupplierUpsertSchema & {
  materials?: SupplierCreateMaterialFormRow[];
};

export default function SupplierCreateForm() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [form] = Form.useForm<SupplierCreateFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trigger: createSupplier } = useSupplierCreate();
  const { trigger: createMaterial } = useSupplierMaterialCreate();

  const onFinish = async (values: SupplierCreateFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: SupplierUpsertSchema = {
        name: values.name,
        contact_person: values.contact_person,
        phone: values.phone,
        address: values.address,
      };

      const createdSupplier = await createSupplier(payload);
      const supplierId = createdSupplier.result.id;

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
              supplier_id: supplierId,
              material_id: row.rawMaterialId,
              unit_name: row.unit || 'kg',
              g_per_unit: kgToGrams(row.g_per_unit) ?? '1000',
              price_per_unit: row.price_per_unit ?? '0',
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
    <Form<SupplierCreateFormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        materials: [
          {
            rawMaterialId: undefined,
            price_per_unit: undefined,
            unit: '',
            g_per_unit: undefined,
          },
        ],
      }}
    >
      <Title level={4}>{t('supplierBasicInfo')}</Title>

      <div className="grid w-full grid-cols-4 gap-4">
        <Form.Item
          label={t('commonName')}
          name="name"
          rules={[{ required: true, message: t('supplierRequired') }]}
        >
          <Input placeholder={t('supplierNamePlaceholder')} />
        </Form.Item>

        <Form.Item label={t('commonContactPerson')} name="contact_person">
          <Input placeholder={t('supplierContactPlaceholder')} />
        </Form.Item>

        <Form.Item label={t('commonPhone')} name="phone">
          <Input placeholder={t('supplierPhonePlaceholder')} />
        </Form.Item>

        <Form.Item label={t('commonAddress')} name="address">
          <Input placeholder={t('commonAddress')} />
        </Form.Item>
      </div>

      <div className="mt-6">
        <Title level={4} className="mb-1">
          {t('supplierMaterialDetails')}
        </Title>
        <Text type="secondary">{t('supplierMaterialDetailsDesc')}</Text>

        <div className="mt-4 max-w-275">
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
