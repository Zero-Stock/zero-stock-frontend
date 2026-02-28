import SupplierCreateForm from '@/modules/supplier/components/SupplierCreateForm';
import { Typography } from 'antd';

const { Title } = Typography;

export default function SupplierCreatePage() {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Add New Supplier</Title>

      <div style={{ marginTop: '24px' }}>
        <SupplierCreateForm />
      </div>
    </div>
  );
}
