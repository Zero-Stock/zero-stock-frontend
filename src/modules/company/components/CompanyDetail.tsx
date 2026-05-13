import { Button, Space, Spin, Typography } from 'antd';
import { useLocation } from 'wouter';

import { useCompanyDetail } from '../hooks/useCompanyDetail';
import CompanyRegionTable from './CompanyRegionTable';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title, Text } = Typography;

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
          <Text type="secondary">
            {company.code} · {company.contact_person} · {company.phone} ·{' '}
            {company.address}
          </Text>
        </div>

        <Button onClick={() => navigate('/company')}>{t('companyBack')}</Button>
      </Space>

      <Text className="mt-6 block">{company.description || t('none')}</Text>

      <div className="mt-6">
        <CompanyRegionTable regions={company.regions} />
      </div>
    </div>
  );
}
