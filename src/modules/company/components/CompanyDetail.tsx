import { Button, Descriptions, Space, Spin, Typography } from 'antd';
import { useLocation } from 'wouter';

import { useCompanyDetail } from '../hooks/useCompanyDetail';
import CompanyRegionTable from './CompanyRegionTable';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title } = Typography;

export default function CompanyDetail({ companyId }: { companyId: string }) {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const idNum = Number(companyId);
  const { company, isLoading } = useCompanyDetail(idNum);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Title level={3}>{t('companyNotFound')}</Title>
        <Button onClick={() => navigate('/company')}>{t('companyBack')}</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Space className="w-full justify-between" align="start">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            {company.name}
          </Title>
          <Descriptions
            column={3}
            className="my-5!"
            items={[
              {
                key: 'code',
                label: t('companyCode'),
                children: company.code || '-',
              },
              {
                key: 'contact_person',
                label: t('commonContactPerson'),
                children: company.contact_person || '-',
              },
              {
                key: 'phone',
                label: t('commonPhone'),
                children: company.phone || '-',
              },
              {
                key: 'address',
                label: t('commonAddress'),
                children: company.address || '-',
              },
              {
                key: 'description',
                label: t('companyDescription'),
                children: company.description || t('none'),
                span: 2,
              },
            ]}
          />
        </div>

        <Button onClick={() => navigate('/company')}>{t('companyBack')}</Button>
      </Space>

      <div className="mt-6">
        <CompanyRegionTable regions={company.regions} />
      </div>
    </div>
  );
}
