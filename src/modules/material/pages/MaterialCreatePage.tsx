import NewMaterialForm from '@/modules/material/components/NewMaterialForm';
import { Typography } from 'antd';

const { Title } = Typography;

export default function MaterialCreatePage() {
  return (
    <div className="p-6">
      <Title level={3}>{'新建食材'}</Title>
      <div className="mt-6">
        <NewMaterialForm />
      </div>
    </div>
  );
}
