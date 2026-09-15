import { App, Button, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useLocation } from 'wouter';

import { useCompanyCreate } from '../hooks/useCompanyCreate';
import CompanyCreateRegionTable from './CompanyCreateRegionTable';
import type {
  CompanyRegionUpsertSchema,
  CompanyUpsertSchema,
} from '@/shared/types/schema';
import { CompaniesControllerCreateCompanyBody } from '@/shared/types/company.zod';
import { zodErrorToFormFields } from '@/shared/utils/form';

const { Title, Text } = Typography;
const { TextArea } = Input;

const companyFieldLabels = {
  name: '名称',
  code: '公司编码',
  contact_person: '联系人',
  phone: '电话',
  address: '地址',
  description: '描述',
  'regions.*.name': '区域名称',
} as const;

export default function CompanyCreateForm() {
  const { message } = App.useApp();
  const [, navigate] = useLocation();
  const [form] = Form.useForm<CompanyUpsertSchema>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trigger: createCompany } = useCompanyCreate();

  const onFinish = async (values: CompanyUpsertSchema) => {
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

      const parsedPayload =
        CompaniesControllerCreateCompanyBody.safeParse(payload);
      if (!parsedPayload.success) {
        form.setFields(
          zodErrorToFormFields(parsedPayload.error, companyFieldLabels),
        );
        message.error('请检查表单内容');
        return;
      }

      const createdCompany = await createCompany(parsedPayload.data);
      const companyId = createdCompany.result.id;

      if (!companyId) {
        message.error('获取创建的公司 ID 失败。');
        return;
      }

      message.success('公司已创建');
      navigate(`/company/${companyId}`);
    } catch (err) {
      console.error(err);
      message.error('创建公司失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<CompanyUpsertSchema>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ regions: [{ name: '' }] }}
    >
      <Title level={4}>{'基础信息'}</Title>

      <div className="grid w-full grid-cols-4 gap-4">
        <Form.Item label={'名称'} name="name">
          <Input placeholder={'公司名称'} />
        </Form.Item>

        <Form.Item label={'公司编码'} name="code">
          <Input placeholder={'公司编码'} />
        </Form.Item>

        <Form.Item label={'联系人'} name="contact_person">
          <Input placeholder={'联系人名称'} />
        </Form.Item>

        <Form.Item label={'电话'} name="phone">
          <Input placeholder={'电话号码'} />
        </Form.Item>

        <Form.Item label={'地址'} name="address" className="col-span-2">
          <Input placeholder={'地址'} />
        </Form.Item>

        <Form.Item label={'描述'} name="description" className="col-span-2">
          <TextArea rows={1} placeholder={'公司描述'} />
        </Form.Item>
      </div>

      <div className="mt-6">
        <Title level={4} className="mb-1">
          {'区域明细'}
        </Title>
        <Text type="secondary">
          {'可选。您可以在此处添加区域，或稍后在公司详情页中进行编辑。'}
        </Text>

        <div className="mt-4 max-w-180">
          <CompanyCreateRegionTable />
        </div>
      </div>

      <div className="mt-6 flex w-full justify-end gap-3">
        <Button onClick={() => navigate('/company')} disabled={isSubmitting}>
          {'取消'}
        </Button>

        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {'保存'}
        </Button>
      </div>
    </Form>
  );
}
