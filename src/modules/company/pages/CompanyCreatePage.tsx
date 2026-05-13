import CompanyCreateForm from '@/modules/company/components/CompanyCreateForm';
import { Typography } from 'antd';

const { Title } = Typography;

export default function CompanyCreatePage() {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Add New Company</Title>

      <div style={{ marginTop: '24px' }}>
        <CompanyCreateForm />
      </div>
    </div>
  );
}
