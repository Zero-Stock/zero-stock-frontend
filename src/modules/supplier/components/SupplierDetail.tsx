import { Button, Descriptions, Space, Typography, Spin } from 'antd';
import { useLocation } from 'wouter';
import { useSupplierDetail } from '../hooks/useSupplierDetail';
import SupplierMaterialTable from './SupplierMaterialTable';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title } = Typography;

export default function SupplierDetail({ supplierId }: { supplierId: string }) {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const idNum = Number(supplierId);
  const { supplier, isLoading } = useSupplierDetail(idNum);

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
          <Title level={3} style={{ marginBottom: 4 }}>
            {supplier.name}
          </Title>
          <Descriptions
            column={3}
            className="my-5!"
            items={[
              {
                key: 'contact_person',
                label: t('commonContactPerson'),
                children: supplier.contact_person || '-',
              },
              {
                key: 'phone',
                label: t('commonPhone'),
                children: supplier.phone || '-',
              },
              {
                key: 'address',
                label: t('commonAddress'),
                children: supplier.address || '-',
              },
            ]}
          />
        </div>

        <Space>
          <Button onClick={() => navigate('/supplier')}>
            {t('supplierBack')}
          </Button>
          <Button
            type="primary"
            onClick={() => navigate(`/supplier/update/${supplier.id}`)}
          >
            {t('supplierEdit')}
          </Button>
        </Space>
      </Space>

      <div className="mt-6">
        <SupplierMaterialTable supplierId={supplier.id} />
      </div>
    </div>
  );
}
