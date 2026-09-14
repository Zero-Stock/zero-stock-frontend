import { useMemo, useState } from 'react';
import {
  App,
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import { useLocation } from 'wouter';

import useMaterialOptions from '@/modules/material/hooks/useMaterialOptions';
import { useSupplierList } from '../hooks/useSupplierList';
import { useSupplierDelete } from '../hooks/useSupplierDelete';
import type { SupplierPreviewSchema } from '@/shared/types/schema';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

export default function SupplierList() {
  const { message } = App.useApp();
  const [, navigate] = useLocation();

  const [keyword, setKeyword] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { materialOptions, isLoading: isLoadingMaterials } =
    useMaterialOptions();

  const payload = useMemo(() => {
    return {
      name: keyword.trim() || undefined,
      material_id: selectedMaterialId,
      page,
      page_size: pageSize,
    };
  }, [keyword, page, pageSize, selectedMaterialId]);

  const { suppliers, total, isLoading, mutate } = useSupplierList(payload);

  const { trigger: deleteTrigger } = useSupplierDelete();

  const columns: ColumnsType<SupplierPreviewSchema> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
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
      width: 220,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/supplier/${record.id}`)}
            className="p-0!"
          >
            {'详情'}
          </Button>

          <Button
            type="link"
            onClick={() => navigate(`/supplier/update/${record.id}`)}
            className="p-0!"
          >
            {'编辑'}
          </Button>

          <Popconfirm
            title={'确定删除该供应商吗？'}
            okText={'删除'}
            okButtonProps={{ danger: true }}
            cancelText={'取消'}
            onConfirm={async () => {
              await deleteTrigger(record.id);
              message.success('供应商已删除');
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
          {'供应商列表'}
        </Title>
        <Button type="primary" onClick={() => navigate('/supplier/create')}>
          {'新建供应商'}
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Input.Search
          placeholder={'搜索供应商名'}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          className="w-60!"
          allowClear
        />
        <Select
          allowClear
          showSearch={{ optionFilterProp: 'label' }}
          placeholder={'选择食材'}
          value={selectedMaterialId}
          onChange={(value) => {
            setSelectedMaterialId(value);
            setPage(1);
          }}
          options={materialOptions}
          loading={isLoadingMaterials}
          className="w-60"
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
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
