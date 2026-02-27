import NewMaterialForm from '@/modules/material/components/NewMaterialForm';
import { Breadcrumb, Typography } from 'antd';
import { Link } from 'wouter';

const { Title } = Typography;

export default function MaterialCreatePage() {
  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          {
            title: <Link to="/material">Raw Materials</Link>,
          },
          {
            title: 'Create',
          },
        ]}
        className="mb-4"
      />
      <Title level={2}>Add New Raw Materials</Title>
      <div className="mt-6">
        <NewMaterialForm />
      </div>
    </div>
  );
}
