import { Button, Space, Typography, Spin } from 'antd';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { useSupplierDetail } from '../hooks/useSupplierDetail';
import { useSupplierUpdate } from '../hooks/useSupplierUpdate';
import SupplierEditModal from './SupplierEditModal';
import SupplierMaterialTable from './SupplierMaterialTable';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title, Text } = Typography;

export default function SupplierDetail({ supplierId }: { supplierId: string }) {
  const { t } = useTranslation();
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
      <div className="flex h-full flex-col items-center justify-center">
        <Title level={3}>{t('supplierNotFound')}</Title>
        <Button onClick={() => navigate('/supplier')}>
          {t('supplierBack')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Space className="w-full justify-between" align="start">
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            {supplier.name}
          </Title>
          <Text type="secondary">
            {supplier.contact_person} · {supplier.phone} · {supplier.address}
          </Text>
        </div>

        <Space>
          <Button onClick={() => navigate('/supplier')}>
            {t('supplierBack')}
          </Button>
          <Button type="primary" onClick={() => setEditOpen(true)}>
            {t('supplierEdit')}
          </Button>
        </Space>
      </Space>

      <div className="mt-6">
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
