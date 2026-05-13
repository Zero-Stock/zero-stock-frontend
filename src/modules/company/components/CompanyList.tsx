import { useMemo, useState } from 'react';
import { Button, Input, Space, Table, Typography } from 'antd';
import { useLocation } from 'wouter';
import type { ColumnsType } from 'antd/es/table';

import { useCompanyList } from '../hooks/useCompanyList';
import type { CompanyPreviewSchema } from '@/shared/types/schema';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title } = Typography;

export default function CompanyList() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const [keyword, setKeyword] = useState('');
  const [code, setCode] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const payload = useMemo(() => {
    return {
      name: keyword.trim() || undefined,
      code: code.trim() || undefined,
      page,
      page_size: pageSize,
    };
  }, [code, keyword, page, pageSize]);

  const { companies, total, isLoading } = useCompanyList(payload);

  const columns: ColumnsType<CompanyPreviewSchema> = [
    { title: t('commonName'), dataIndex: 'name', key: 'name' },
    { title: t('companyCode'), dataIndex: 'code', key: 'code', width: 140 },
    {
      title: t('commonContactPerson'),
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    { title: t('commonPhone'), dataIndex: 'phone', key: 'phone' },
    { title: t('commonAddress'), dataIndex: 'address', key: 'address' },
    {
      title: t('commonOperation'),
      key: 'operation',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/company/${record.id}`)}
            className="p-0!"
          >
            {t('companyDetail')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('companyListTitle')}
        </Title>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Input.Search
          placeholder={t('companySearchName')}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          className="w-60!"
          allowClear
        />
        <Input.Search
          placeholder={t('companySearchCode')}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setPage(1);
          }}
          className="w-60!"
          allowClear
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={companies}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={(pagination) => {
          setPage(pagination.current ?? 1);
          setPageSize(pagination.pageSize ?? 10);
        }}
        tableLayout="fixed"
      />
    </div>
  );
}
