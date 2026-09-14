import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { CompanyRegionSchema } from '@/shared/types/schema';

const { Title } = Typography;

interface CompanyRegionTableProps {
  regions: CompanyRegionSchema[];
}

export default function CompanyRegionTable({
  regions,
}: CompanyRegionTableProps) {
  const columns: ColumnsType<CompanyRegionSchema> = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '区域名称',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <div>
      <Title level={4}>{'公司区域'}</Title>
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
