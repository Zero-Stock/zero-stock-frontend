import {
  CalendarOutlined,
  FireOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Typography } from 'antd';
import { useLocation } from 'wouter';

const { Paragraph, Text } = Typography;

const quickLinks = [
  {
    path: '/diet',
    icon: <CalendarOutlined className="text-xl" />,
    title: '膳食计划',
    description: '维护膳食计划并核对每个餐次的菜品安排。',
  },
  {
    path: '/census',
    icon: <TeamOutlined className="text-xl" />,
    title: '人数统计',
    description: '更新各区域各餐次人数，为后续采购和加工提供基础。',
  },
  {
    path: '/procurement/purchase/',
    icon: <ShoppingCartOutlined className="text-xl" />,
    title: '采购单',
    description: '查看并生成采购单，跟进供应商分配情况。',
  },
  {
    path: '/processing',
    icon: <FireOutlined className="text-xl" />,
    title: '加工管理',
    description: '按加工规格检查今日需要执行的食材处理任务。',
  },
] as const;

export default function QuickStartSection() {
  const [, setLocation] = useLocation();
  return (
    <Card
      title={'快速开始'}
      extra={<Text type="secondary">{'从最常用的业务入口继续今天的工作'}</Text>}
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
                    {link.title}
                  </Text>
                  <Paragraph className="mt-1! mb-0! text-sm! text-slate-500!">
                    {link.description}
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
