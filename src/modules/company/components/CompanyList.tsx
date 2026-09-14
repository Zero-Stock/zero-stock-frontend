import { useMemo, useState } from 'react';
import { App, Button, Input, Popconfirm, Space, Table, Typography } from 'antd';
import { useLocation } from 'wouter';
import type { ColumnsType } from 'antd/es/table';

import { useCompanyList } from '../hooks/useCompanyList';
import { useCompanyDelete } from '../hooks/useCompanyDelete';
import type { CompanyPreviewSchema } from '@/shared/types/schema';

const { Title } = Typography;

export default function CompanyList() {
  const { message } = App.useApp();
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

  const { companies, total, isLoading, mutate } = useCompanyList(payload);
  const { trigger: deleteTrigger } = useCompanyDelete();

  const columns: ColumnsType<CompanyPreviewSchema> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '公司编码', dataIndex: 'code', key: 'code', width: 140 },
    {
      title: '联系人',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    {
      title: '操作',
      key: 'operation',
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/company/${record.id}`)}
            className="p-0!"
          >
            {'详情'}
          </Button>
          <Popconfirm
            title={'确定删除该公司吗？'}
            okText={'删除'}
            okButtonProps={{ danger: true }}
            cancelText={'取消'}
            onConfirm={async () => {
              await deleteTrigger(record.id);
              message.success('公司已删除');
              mutate();
            }}
          >
            <Button type="link" danger className="p-0!">
              {'删除'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {'公司列表'}
        </Title>
        <Button type="primary" onClick={() => navigate('/company/create')}>
          {'新建公司'}
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Input.Search
          placeholder={'搜索公司名'}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          className="w-60!"
          allowClear
        />
        <Input.Search
          placeholder={'搜索公司编码'}
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
