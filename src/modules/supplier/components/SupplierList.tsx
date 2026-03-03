import { useMemo, useState } from 'react';
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { useLocation } from 'wouter';

import SupplierEditModal from './SupplierEditModal';
import { useSupplierList } from '../hooks/useSupplierList';
import { useSupplierUpdate } from '../hooks/useSupplierUpdate';
// import { useSupplierDelete } from '../hooks/useSupplierDelete'; // 如果后端支持 DELETE 再打开

import type { SupplierPreviewDto } from '../dtos/supplierPreview.dto';
import type { SupplierUpdateDto } from '../dtos/supplierUpdate.dto';

const { Title } = Typography;

export default function SupplierList() {
  const [, navigate] = useLocation();

  const [keyword, setKeyword] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<SupplierUpdateDto | null>(null);

  // ✅ 用后端 search（GET /api/suppliers/?search=xxx）
  const { suppliers, isLoading, mutate } = useSupplierList({
    search: keyword.trim() || undefined,
  });

  const { trigger: updateTrigger } = useSupplierUpdate();
  // const { trigger: deleteTrigger } = useSupplierDelete();

  // 如果你想“前端再筛一次”，也可以；但既然后端支持 search，这里一般不需要
  const dataSource = useMemo(() => suppliers, [suppliers]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: SupplierPreviewDto, b: SupplierPreviewDto) => a.id - b.id,
      defaultSortOrder: 'ascend' as const,
      width: 120,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Contact Person',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Operation',
      key: 'operation',
      width: 220,
      render: (_: any, record: SupplierPreviewDto) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/supplier/${record.id}`)}
          >
            Detail
          </Button>

          <Button
            type="link"
            className="p-0"
            onClick={() => {
              // ✅ list 里的字段足够编辑供应商基本信息
              setEditing({
                id: record.id,
                name: record.name,
                contact_person: record.contact_person,
                phone: record.phone,
                address: record.address,
              });
              setEditOpen(true);
            }}
          >
            Edit
          </Button>

          {/* 如果后端确认支持 DELETE /api/suppliers/{id}/ 再打开 */}
          {/* 
          <Popconfirm
            title="Delete this supplier?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={async () => {
              await deleteTrigger(record.id);
              message.success('Deleted');
              mutate();
            }}
          >
            <Button type="link" danger className="p-0">Delete</Button>
          </Popconfirm>
          */}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Suppliers
        </Title>

        <Button type="primary" onClick={() => navigate('/supplier/create')}>
          Create Supplier
        </Button>
      </div>

      <Input
        placeholder="Search by supplier name"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 16 }}
        allowClear
      />

      <Table
        rowKey="id"
        columns={columns as any}
        dataSource={dataSource}
        loading={isLoading}
      />

      <SupplierEditModal
        open={editOpen}
        supplier={editing}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onSave={async (next) => {
          await updateTrigger(next);
          message.success('Updated');
          mutate(); // ✅ 刷新列表
          setEditOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
