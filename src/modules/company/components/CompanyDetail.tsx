import { Button, Descriptions, Space, Spin, Typography } from 'antd';
import { useLocation } from 'wouter';

import { useCompanyDetail } from '../hooks/useCompanyDetail';
import CompanyRegionTable from './CompanyRegionTable';

const { Title } = Typography;

export default function CompanyDetail({ companyId }: { companyId: string }) {
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
        <Title level={3}>{'未找到公司'}</Title>
        <Button onClick={() => navigate('/company')}>{'返回'}</Button>
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
                label: '公司编码',
                children: company.code || '-',
              },
              {
                key: 'contact_person',
                label: '联系人',
                children: company.contact_person || '-',
              },
              {
                key: 'phone',
                label: '电话',
                children: company.phone || '-',
              },
              {
                key: 'address',
                label: '地址',
                children: company.address || '-',
              },
              {
                key: 'description',
                label: '描述',
                children: company.description || '无',
                span: 2,
              },
            ]}
          />
        </div>

        <Button onClick={() => navigate('/company')}>{'返回'}</Button>
      </Space>

      <div className="mt-6">
        <CompanyRegionTable regions={company.regions} />
      </div>
    </div>
  );
}
