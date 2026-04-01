import { CheckCircleOutlined } from '@ant-design/icons';
import { Card, List, Space, Typography } from 'antd';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Text } = Typography;

export default function ShiftChecklistSection() {
  const { t } = useTranslation();

  return (
    <Card title={t('homeChecklistTitle')}>
      <List
        dataSource={[
          t('homeChecklistOne'),
          t('homeChecklistTwo'),
          t('homeChecklistThree'),
          t('homeChecklistFour'),
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
