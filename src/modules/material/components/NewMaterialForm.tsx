'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface RawMaterialFields {
  name: string;
  category: string;
  unit: string;
  conversion: string;
}

export default function NewMaterialForm() {
  const [form] = Form.useForm();

  const categories = ['冻品', '粮油', '肉类', '蔬菜'];

  const columns: ColumnsType<{ key: number | string }> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'name']}
          rules={[{ required: true, message: 'Please input name' }]}
          className="!mb-0"
        >
          <Input placeholder="Input raw material name" />
        </Form.Item>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'category']}
          rules={[{ required: true, message: 'Please select category' }]}
          className="!mb-0"
        >
          <Select placeholder="Select category" className="w-full">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'unit']}
          rules={[{ required: true, message: 'Please input unit' }]}
          className="!mb-0"
        >
          <Input placeholder="e.g. 箱 / 袋 / kg" />
        </Form.Item>
      ),
    },
    {
      title: 'Conversion',
      dataIndex: 'conversion',
      key: 'conversion',
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'conversion']}
          rules={[{ required: true, message: 'Please input conversion' }]}
          className="!mb-0"
        >
          <Input placeholder="e.g. 10kg" />
        </Form.Item>
      ),
    },
  ];

  const onFinish = (values: { items: RawMaterialFields[] }) => {
    console.log('Received values:', values);
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={{ items: [{}] }}>
      <Form.List name="items">
        {(fields, { add }) => (
          <>
            <Table
              dataSource={fields}
              columns={columns}
              pagination={false}
              rowKey="key"
              footer={() => (
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  className="mt-2"
                >
                  Add New Row
                </Button>
              )}
            />
            <div className="mt-4 text-right">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </>
        )}
      </Form.List>
    </Form>
  );
}
