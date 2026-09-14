import {
  CalendarOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Typography } from 'antd';

const { Paragraph, Text } = Typography;

export default function TodayOverviewSection() {
  return (
    <Card
      variant="borderless"
      className="rounded-3xl shadow-sm"
      styles={{ body: { padding: 24 } }}
    >
      <Space orientation="vertical" size={20} className="w-full">
        <div>
          <Text strong>{'今日概览'}</Text>
          <Paragraph className="mt-2! mb-0! text-sm! text-slate-500!">
            {'用一个统一视图把当天的主流程衔接起来。'}
          </Paragraph>
        </div>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title={'膳食菜单项'}
              value={24}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={'待采购单'}
              value={8}
              prefix={<ShoppingCartOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={'加工明细'}
              value={16}
              prefix={<FireOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={'执行就绪度'}
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
