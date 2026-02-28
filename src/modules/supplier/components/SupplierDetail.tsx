import { Button, Space, Typography } from 'antd';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { getSupplierById, updateSupplier, type Supplier } from '../mockdata';
import SupplierEditModal from './SupplierEditModal';
import SupplierMaterialTable from './SupplierMaterialTable';

const { Title, Text } = Typography;

export default function SupplierDetail({ supplierId }: { supplierId: string }) {
  const [, navigate] = useLocation();

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setSupplier(getSupplierById(supplierId));
  }, [supplierId]);

  if (!supplier) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={3}>Supplier not found</Title>
        <Button onClick={() => navigate('/supplier')}>Back</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{ width: '100%', justifyContent: 'space-between' }}
        align="start"
      >
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            {supplier.name}
          </Title>
          <Text type="secondary">
            {supplier.contact} · {supplier.address}
          </Text>
        </div>

        <Space>
          <Button onClick={() => navigate('/supplier')}>Back</Button>
          <Button type="primary" onClick={() => setEditOpen(true)}>
            Edit Supplier
          </Button>
        </Space>
      </Space>

      <div style={{ marginTop: 24 }}>
        <SupplierMaterialTable supplierId={supplier.id} />
      </div>

      <SupplierEditModal
        open={editOpen}
        supplier={supplier}
        onCancel={() => setEditOpen(false)}
        onSave={(next) => {
          updateSupplier(next);
          setSupplier(next);
          setEditOpen(false);
        }}
      />
    </div>
  );
}
