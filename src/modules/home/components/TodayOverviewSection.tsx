import {
  CalendarOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Paragraph, Text } = Typography;

export default function TodayOverviewSection() {
  const { t } = useTranslation();

  return (
    <Card
      variant="borderless"
      className="rounded-3xl shadow-sm"
      styles={{ body: { padding: 24 } }}
    >
      <Space orientation="vertical" size={20} className="w-full">
        <div>
          <Text strong>{t('homeOverviewTitle')}</Text>
          <Paragraph className="mt-2! mb-0! text-sm! text-slate-500!">
            {t('homeOverviewDescription')}
          </Paragraph>
        </div>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title={t('homeStatMeals')}
              value={24}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={t('homeStatProcurement')}
              value={8}
              prefix={<ShoppingCartOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={t('homeStatProcessing')}
              value={16}
              prefix={<FireOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={t('homeStatReadiness')}
              value={92}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Col>
        </Row>
      </Space>
    </Card>
  );
}
