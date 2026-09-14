import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export default function CompanyCreateRegionTable() {
  return (
    <Form.List name="regions">
      {(fields, { add, remove }) => {
        const columns: ColumnsType<(typeof fields)[number]> = [
          {
            title: '区域名称',
            dataIndex: 'name',
            key: 'name',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'name']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder={'区域名称'} />
              </Form.Item>
            ),
          },
          {
            title: '',
            key: 'action',
            width: '10%',
            align: 'right',
            render: (_, _record, index) => (
              <Button
                danger
                type="link"
                onClick={() => remove(fields[index].name)}
              >
                {'删除'}
              </Button>
            ),
          },
        ];

        return (
          <Table
            dataSource={fields}
            columns={columns}
            pagination={false}
            rowKey="key"
            footer={() => (
              <Button
                type="dashed"
                onClick={() => add({ name: '' })}
                block
                icon={<PlusOutlined />}
                className="mt-1"
              >
                {'新增一行'}
              </Button>
            )}
          />
        );
      }}
    </Form.List>
  );
}
