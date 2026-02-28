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
import {
  deleteSupplier,
  listSuppliers,
  updateSupplier,
  type Supplier,
} from '../mockdata';
import SupplierEditModal from './SupplierEditModal';
import { useLocation } from 'wouter';

const { Title } = Typography;

export default function SupplierList() {
  const [, navigate] = useLocation();

  const [suppliers, setSuppliers] = useState<Supplier[]>(listSuppliers());
  const [keyword, setKeyword] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return suppliers;
    return suppliers.filter((s) => {
      return (
        s.id.toLowerCase().includes(k) ||
        s.name.toLowerCase().includes(k) ||
        s.contact.toLowerCase().includes(k) ||
        s.address.toLowerCase().includes(k)
      );
    });
  }, [suppliers, keyword]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Supplier, b: Supplier) => Number(a.id) - Number(b.id),
      defaultSortOrder: 'ascend' as const,
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Operation',
      key: 'operation',
      width: 220,
      render: (_: any, record: Supplier) => (
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
              setEditing(record);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this supplier?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={() => {
              deleteSupplier(record.id);
              setSuppliers(listSuppliers());
              message.success('Deleted');
            }}
          >
            <Button type="link" danger className="p-0">
              Delete
            </Button>
          </Popconfirm>
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

        <Button
          type="primary"
          onClick={() => {
            navigate('/supplier/create');
          }}
        >
          Create Supplier
        </Button>
      </div>

      <Input
        placeholder="Search by id / name / contact / address"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 16 }}
        allowClear
      />

      <Table rowKey="id" columns={columns as any} dataSource={filtered} />

      <SupplierEditModal
        open={editOpen}
        supplier={editing}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onSave={(next) => {
          updateSupplier(next);
          setSuppliers(listSuppliers());
          message.success('Updated');
          setEditOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
