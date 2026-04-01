import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { useLocation } from 'wouter';
import DailyWorkflowSection from '@/modules/home/components/DailyWorkflowSection';
import KeyCadenceSection from '@/modules/home/components/KeyCadenceSection';
import QuickStartSection from '@/modules/home/components/QuickStartSection';
import ShiftChecklistSection from '@/modules/home/components/ShiftChecklistSection';
import TodayOverviewSection from '@/modules/home/components/TodayOverviewSection';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useDateStore } from '@/shared/stores/dateStore';

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { date } = useDateStore();

  return (
    <div className="flex flex-col gap-6">
      <Card
        className="overflow-hidden"
        styles={{
          body: {
            padding: 0,
            background:
              'linear-gradient(135deg, #fff8eb 0%, #fffef8 45%, #eef6ff 100%)',
          },
        }}
      >
        <div className="relative overflow-hidden px-8 py-8 md:px-10">
          <div className="absolute top-0 -right-12 h-44 w-44 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute right-24 bottom-0 h-32 w-32 rounded-full bg-sky-200/40 blur-3xl" />

          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} xl={15}>
              <Space orientation="vertical" size={16} className="w-full">
                <Text className="text-sm! font-medium text-yellow-600!">
                  {t('homeHeroBadge')}
                </Text>

                <div>
                  <Title level={1} className="mb-3! text-4xl! leading-tight!">
                    {t('homeHeroTitle')}
                  </Title>
                  <Paragraph className="mb-0! max-w-2xl! text-base! text-slate-600!">
                    {t('homeHeroDescription')}
                  </Paragraph>
                </div>

                <Space wrap size="middle">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={() => setLocation('/census')}
                  >
                    {t('homePrimaryAction')}
                  </Button>
                  <Button size="large" onClick={() => setLocation('/meal')}>
                    {t('homeSecondaryAction')}
                  </Button>
                  <Text type="secondary">{t('homeDateLabel', { date })}</Text>
                </Space>
              </Space>
            </Col>

            <Col xs={24} xl={9}>
              <TodayOverviewSection />
            </Col>
          </Row>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <QuickStartSection />
        </Col>

        <Col xs={24} xl={8}>
          <KeyCadenceSection />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={14}>
          <DailyWorkflowSection />
        </Col>

        <Col xs={24} xl={10}>
          <ShiftChecklistSection />
        </Col>
      </Row>
    </div>
  );
}
