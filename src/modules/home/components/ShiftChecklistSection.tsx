import { CheckCircleOutlined } from '@ant-design/icons';
import { Card, List, Space, Typography } from 'antd';

const { Text } = Typography;

export default function ShiftChecklistSection() {
  return (
    <Card title={'班前检查清单'}>
      <List
        dataSource={[
          '确认今日生产日期与业务单据日期一致。',
          '检查供应商资料和食材信息是否已维护完整。',
          '在生成采购单前，复核关键菜品的食材配比。',
          '加工执行前，核对食材的加工规格与出成率设置。',
        ]}
        renderItem={(item) => (
          <List.Item className="px-0!">
            <Space align="start">
              <CheckCircleOutlined className="mt-1 text-emerald-500" />
              <Text>{item}</Text>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
}
