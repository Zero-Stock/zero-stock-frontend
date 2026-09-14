import { ClockCircleOutlined } from '@ant-design/icons';
import { Card, List, Progress, Space, Tag, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const operationSteps = [
  {
    title: '确认人数统计',
    description: '先更新各区域人数，后续采购量和加工量才有可靠依据。',
    progress: 100,
    status: '已准备',
  },
  {
    title: '核对膳食计划',
    description: '检查早餐、午餐、晚餐的菜品安排是否符合当日供应计划。',
    progress: 82,
    status: '进行中',
  },
  {
    title: '生成采购与加工',
    description: '根据人数和菜单联动生成采购单、收货单与加工单。',
    progress: 64,
    status: '待检查',
  },
] as const;

type OperationStep = (typeof operationSteps)[number];

export default function DailyWorkflowSection() {
  return (
    <Card
      title={'今日流程推进'}
      extra={
        <Tag icon={<ClockCircleOutlined />} color="processing">
          {'建议顺序'}
        </Tag>
      }
    >
      <List
        itemLayout="vertical"
        dataSource={[...operationSteps]}
        renderItem={(step: OperationStep, index) => (
          <List.Item key={step.title} className="px-0!">
            <Space orientation="vertical" size={10} className="w-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Text strong>
                    {index + 1}. {step.title}
                  </Text>
                  <Paragraph className="mt-1! mb-0! text-sm! text-slate-500!">
                    {step.description}
                  </Paragraph>
                </div>
                <Tag color="blue">{step.status}</Tag>
              </div>
              <Progress percent={step.progress} showInfo={false} />
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
}
