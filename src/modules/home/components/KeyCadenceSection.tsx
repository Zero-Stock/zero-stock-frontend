import { Card, Space, Typography } from 'antd';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Text } = Typography;

const highlights = [
  { value: '08:30', labelKey: 'homeHighlightCutoff' },
  { value: '12', labelKey: 'homeHighlightZones' },
  { value: '4', labelKey: 'homeHighlightStages' },
] as const;

export default function KeyCadenceSection() {
  const { t } = useTranslation();

  return (
    <Card title={t('homeHighlightsTitle')}>
      <Space orientation="vertical" size={16} className="w-full">
        {highlights.map((item) => (
          <div
            key={item.labelKey}
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
          >
            <Text type="secondary">{t(item.labelKey)}</Text>
            <Text strong>{item.value}</Text>
          </div>
        ))}
      </Space>
    </Card>
  );
}
