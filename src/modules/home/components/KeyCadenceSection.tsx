import { Card, Space, Typography } from 'antd';

const { Text } = Typography;

const highlights = [
  { value: '08:30', label: '人数确认建议时间' },
  { value: '12', label: '服务区域数量' },
  { value: '4', label: '核心生产阶段' },
] as const;

export default function KeyCadenceSection() {
  return (
    <Card title={'关键节奏'}>
      <Space orientation="vertical" size={16} className="w-full">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
          >
            <Text type="secondary">{item.label}</Text>
            <Text strong>{item.value}</Text>
          </div>
        ))}
      </Space>
    </Card>
  );
}
