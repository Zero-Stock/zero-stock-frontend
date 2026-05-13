import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { CompanyRegionOptionSchema } from '@/shared/types/schema';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title } = Typography;

interface CompanyRegionTableProps {
  regions: CompanyRegionOptionSchema[];
}

export default function CompanyRegionTable({
  regions,
}: CompanyRegionTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<CompanyRegionOptionSchema> = [
    {
      title: t('commonId'),
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: t('companyRegionName'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <div>
      <Title level={4}>{t('companyRegionsTitle')}</Title>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={regions}
        pagination={false}
        tableLayout="fixed"
      />
    </div>
  );
}
