import { Button, Descriptions, Space, Typography, Spin } from 'antd';
import { useLocation } from 'wouter';
import { useSupplierDetail } from '../hooks/useSupplierDetail';
import SupplierMaterialTable from './SupplierMaterialTable';

const { Title } = Typography;

export default function SupplierDetail({ supplierId }: { supplierId: string }) {
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
        <Title level={3}>{'未找到供应商'}</Title>
        <Button onClick={() => navigate('/supplier')}>{'返回'}</Button>
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
                label: '联系人',
                children: supplier.contact_person || '-',
              },
              {
                key: 'phone',
                label: '电话',
                children: supplier.phone || '-',
              },
              {
                key: 'address',
                label: '地址',
                children: supplier.address || '-',
              },
            ]}
          />
        </div>

        <Space>
          <Button onClick={() => navigate('/supplier')}>{'返回'}</Button>
          <Button
            type="primary"
            onClick={() => navigate(`/supplier/update/${supplier.id}`)}
          >
            {'编辑供应商'}
          </Button>
        </Space>
      </Space>

      <div className="mt-6">
        <SupplierMaterialTable supplierId={supplier.id} />
      </div>
    </div>
  );
}
