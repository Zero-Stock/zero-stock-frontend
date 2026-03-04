import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
} from 'antd';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMaterialList } from '@/modules/material/hooks/useMaterialList';
import { useSupplierCreate } from '../hooks/useSupplierCreate';
import { useSupplierMaterialCreate } from '../hooks/useSupplierMaterialCreate';
import type { SupplierCreateDto } from '../dtos/supplierCreate.dto';
import { useTranslation } from '@/shared/i18n/LanguageContext';

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

  const { materialOptions } = useMaterialList();
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
      <Title level={4} style={{ marginTop: 0 }}>
        {t('supplierBasicInfo')}
      </Title>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 16,
          maxWidth: 1100,
        }}
      >
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

        <div
          style={{
            marginTop: 16,
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 12,
            padding: 16,
            maxWidth: 1100,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
              gap: 16,
              padding: '8px 8px 12px',
              fontWeight: 600,
            }}
          >
            <div>{t('supplierMaterial')}</div>
            <div>{t('supplierPrice')}</div>
            <div>{t('supplierUnitSpec')}</div>
            <div>{t('supplierKgPerUnit')}</div>
          </div>

          <Form.List name="materials">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                      gap: 16,
                      padding: '8px',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'rawMaterialId']}
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        placeholder={t('supplierSelectMaterial')}
                        options={materialOptions}
                        showSearch
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder={t('supplierPricePlaceholder')}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'unit']}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder={t('supplierUnitPlaceholder')} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'kg_per_unit']}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        min={0}
                        step={0.01}
                        style={{ width: '100%' }}
                        placeholder={t('supplierKgPlaceholder')}
                      />
                    </Form.Item>

                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button
                        danger
                        type="link"
                        onClick={() => remove(name)} // <-- Use 'name' here
                      >
                        {t('delete')}
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add button remains the same */}
                <div className="mt-3">
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        rawMaterialId: undefined,
                        price: undefined,
                        unit: '',
                        kg_per_unit: undefined,
                      })
                    }
                    className="w-full rounded-xl py-1"
                  >
                    {t('materialAddRow')}
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          maxWidth: 1100,
        }}
      >
        <Button
          style={{ height: 40, borderRadius: 10 }}
          onClick={() => {
            navigate('/supplier');
          }}
          disabled={isSubmitting}
        >
          {t('cancel')}
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          style={{ height: 40, borderRadius: 10 }}
        >
          {t('save')}
        </Button>
      </div>
    </Form>
  );
}
