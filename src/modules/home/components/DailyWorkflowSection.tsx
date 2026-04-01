import { ClockCircleOutlined } from '@ant-design/icons';
import { Card, List, Progress, Space, Tag, Typography } from 'antd';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Paragraph, Text } = Typography;

const operationSteps = [
  {
    titleKey: 'homeStepCensusTitle',
    descriptionKey: 'homeStepCensusDesc',
    progress: 100,
    statusKey: 'homeStatusReady',
  },
  {
    titleKey: 'homeStepMealsTitle',
    descriptionKey: 'homeStepMealsDesc',
    progress: 82,
    statusKey: 'homeStatusInProgress',
  },
  {
    titleKey: 'homeStepProcurementTitle',
    descriptionKey: 'homeStepProcurementDesc',
    progress: 64,
    statusKey: 'homeStatusAttention',
  },
] as const;

type OperationStep = (typeof operationSteps)[number];

export default function DailyWorkflowSection() {
  const { t } = useTranslation();

  return (
    <Card
      title={t('homeFlowTitle')}
      extra={
        <Tag icon={<ClockCircleOutlined />} color="processing">
          {t('homeFlowTag')}
        </Tag>
      }
    >
      <List
        itemLayout="vertical"
        dataSource={[...operationSteps]}
        renderItem={(step: OperationStep, index) => (
          <List.Item key={step.titleKey} className="px-0!">
            <Space orientation="vertical" size={10} className="w-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Text strong>
                    {index + 1}. {t(step.titleKey)}
                  </Text>
                  <Paragraph className="mt-1! mb-0! text-sm! text-slate-500!">
                    {t(step.descriptionKey)}
                  </Paragraph>
                </div>
                <Tag color="blue">{t(step.statusKey)}</Tag>
              </div>
              <Progress percent={step.progress} showInfo={false} />
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
}
