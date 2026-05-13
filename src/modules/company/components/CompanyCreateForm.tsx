import { Button, Form, Input, Typography, message } from 'antd';
import { useState } from 'react';
import { useLocation } from 'wouter';

import { useCompanyCreate } from '../hooks/useCompanyCreate';
import CompanyCreateRegionTable from './CompanyCreateRegionTable';
import { useTranslation } from '@/shared/translation/LanguageContext';
import type {
  CompanyRegionUpsertSchema,
  CompanyUpsertSchema,
} from '@/shared/types/schema';

const { Title, Text } = Typography;
const { TextArea } = Input;

type CompanyCreateFormValues = CompanyUpsertSchema & {
  regions?: CompanyRegionUpsertSchema[];
};

export default function CompanyCreateForm() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [form] = Form.useForm<CompanyCreateFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trigger: createCompany } = useCompanyCreate();

  const onFinish = async (values: CompanyCreateFormValues) => {
    setIsSubmitting(true);
    try {
      const regions =
        values.regions?.reduce<CompanyRegionUpsertSchema[]>((acc, region) => {
          const name = region.name?.trim();
          if (!name) return acc;

          acc.push({
            id: region.id,
            name,
          });
          return acc;
        }, []) ?? [];

      const payload: CompanyUpsertSchema = {
        name: values.name,
        code: values.code,
        contact_person: values.contact_person,
        phone: values.phone,
        address: values.address,
        description: values.description,
        regions,
      };

      const createdCompany = await createCompany(payload);
      const companyId = createdCompany.result.id;

      if (!companyId) {
        message.error(t('companyCreateErrorId'));
        return;
      }

      message.success(t('companyCreated'));
      navigate(`/company/${companyId}`);
    } catch (err) {
      console.error(err);
      message.error(t('companyCreateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<CompanyCreateFormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ regions: [{ name: '' }] }}
    >
      <Title level={4}>{t('companyBasicInfo')}</Title>

      <div className="grid w-full grid-cols-4 gap-4">
        <Form.Item
          label={t('commonName')}
          name="name"
          rules={[{ required: true, message: t('companyRequired') }]}
        >
          <Input placeholder={t('companyNamePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('companyCode')}
          name="code"
          rules={[{ required: true, message: t('companyRequired') }]}
        >
          <Input placeholder={t('companyCodePlaceholder')} />
        </Form.Item>

        <Form.Item label={t('commonContactPerson')} name="contact_person">
          <Input placeholder={t('companyContactPlaceholder')} />
        </Form.Item>

        <Form.Item label={t('commonPhone')} name="phone">
          <Input placeholder={t('companyPhonePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('commonAddress')}
          name="address"
          className="col-span-2"
        >
          <Input placeholder={t('commonAddress')} />
        </Form.Item>

        <Form.Item
          label={t('companyDescription')}
          name="description"
          className="col-span-2"
        >
          <TextArea rows={1} placeholder={t('companyDescriptionPlaceholder')} />
        </Form.Item>
      </div>

      <div className="mt-6">
        <Title level={4} className="mb-1">
          {t('companyRegionDetails')}
        </Title>
        <Text type="secondary">{t('companyRegionDetailsDesc')}</Text>

        <div className="mt-4 max-w-180">
          <CompanyCreateRegionTable />
        </div>
      </div>

      <div className="mt-6 flex w-full justify-end gap-3">
        <Button onClick={() => navigate('/company')} disabled={isSubmitting}>
          {t('cancel')}
        </Button>

        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {t('save')}
        </Button>
      </div>
    </Form>
  );
}
