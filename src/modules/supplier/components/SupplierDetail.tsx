import { Button, Space, Typography, Spin } from 'antd';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { useSupplierDetail } from '../hooks/useSupplierDetail';
import { useSupplierUpdate } from '../hooks/useSupplierUpdate';
import SupplierEditModal from './SupplierEditModal';
import SupplierMaterialTable from './SupplierMaterialTable';

const { Title, Text } = Typography;

export default function SupplierDetail({ supplierId }: { supplierId: string }) {
  const [, navigate] = useLocation();

  const idNum = Number(supplierId);
  const { supplier, isLoading, mutate } = useSupplierDetail(idNum);
  const { trigger: updateTrigger } = useSupplierUpdate();

  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex h-full items-center justify-center">
        <Title level={3}>Supplier not found</Title>
        <Button onClick={() => navigate('/supplier')}>Back</Button>
      </div>
    );
  }

  console.log('supplier:', supplier);

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
            {supplier.contact_person} · {supplier.phone} · {supplier.address}
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
        supplier={{
          id: supplier.id,
          name: supplier.name,
          contact_person: supplier.contact_person,
          phone: supplier.phone,
          address: supplier.address,
        }}
        onCancel={() => setEditOpen(false)}
        onSave={async (next) => {
          await updateTrigger(next);
          mutate();
          setEditOpen(false);
        }}
      />
    </div>
  );
}
