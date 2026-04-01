import {
  CalendarOutlined,
  FireOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Typography } from 'antd';
import { useLocation } from 'wouter';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Paragraph, Text } = Typography;

const quickLinks = [
  {
    path: '/meal',
    icon: <CalendarOutlined className="text-xl" />,
    titleKey: 'navMeals',
    descriptionKey: 'homeQuickMealsDesc',
  },
  {
    path: '/census',
    icon: <TeamOutlined className="text-xl" />,
    titleKey: 'navCensus',
    descriptionKey: 'homeQuickCensusDesc',
  },
  {
    path: '/procurement/order',
    icon: <ShoppingCartOutlined className="text-xl" />,
    titleKey: 'navProcurementOrder',
    descriptionKey: 'homeQuickProcurementDesc',
  },
  {
    path: '/processing',
    icon: <FireOutlined className="text-xl" />,
    titleKey: 'navProcessing',
    descriptionKey: 'homeQuickProcessingDesc',
  },
] as const;

export default function QuickStartSection() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
    <Card
      title={t('homeQuickStartTitle')}
      extra={<Text type="secondary">{t('homeQuickStartSubtitle')}</Text>}
    >
      <Row gutter={[16, 16]}>
        {quickLinks.map((link) => (
          <Col xs={24} md={12} key={link.path}>
            <Card
              hoverable
              onClick={() => setLocation(link.path)}
              className="h-full cursor-pointer rounded-2xl"
              styles={{ body: { height: '100%', padding: 20 } }}
            >
              <Space orientation="vertical" size={12} className="w-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  {link.icon}
                </div>
                <div>
                  <Text strong className="text-base">
                    {t(link.titleKey)}
                  </Text>
                  <Paragraph className="mt-1! mb-0! text-sm! text-slate-500!">
                    {t(link.descriptionKey)}
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
