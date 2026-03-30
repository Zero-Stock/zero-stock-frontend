import NewMaterialForm from '@/modules/material/components/NewMaterialForm';
import { Typography } from 'antd';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title } = Typography;

export default function MaterialCreatePage() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <Title level={2}>{t('materialCreateTitle')}</Title>
      <div className="mt-6">
        <NewMaterialForm />
      </div>
    </div>
  );
}
