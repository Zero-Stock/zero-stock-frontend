import { Button, Spin, Typography } from 'antd';
import { useLocation } from 'wouter';
import SupplierUpsertForm from '@/modules/supplier/components/SupplierUpsertForm';
import { useSupplierDetail } from '../hooks/useSupplierDetail';
import { useTranslation } from '@/shared/translation/LanguageContext';
import type { SupplierUpsertSchema } from '@/shared/types/schema';

const { Title } = Typography;

interface SupplierUpdatePageProps {
  params: { supplierId: string };
}

export default function SupplierUpdatePage({ params }: SupplierUpdatePageProps) {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const supplierId = Number(params.supplierId);
  const { supplier, isLoading } = useSupplierDetail(supplierId);

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
        <Button onClick={() => navigate('/supplier')}>{t('supplierBack')}</Button>
      </div>
    );
  }

  const initValues: SupplierUpsertSchema = {
    name: supplier.name,
    contact_person: supplier.contact_person,
    phone: supplier.phone,
    address: supplier.address,
    materials: supplier.materials.map((material) => ({
      material_id: material.material_id,
      unit_name: material.unit_name,
      g_per_unit: material.g_per_unit,
      price_per_unit: material.price_per_unit,
      notes: material.notes,
      is_default: material.isDefaultSupplierMaterial,
    })),
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>{t('supplierEdit')}</Title>

      <div style={{ marginTop: '24px' }}>
        <SupplierUpsertForm supplierId={supplier.id} initValues={initValues} />
      </div>
    </div>
  );
}
