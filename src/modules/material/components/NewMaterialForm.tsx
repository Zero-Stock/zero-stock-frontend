import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation } from 'wouter';
import { useMaterialCreate } from '../hooks/useMaterialCreate';
import useMaterialCategories from '../hooks/useMaterialCategories';

interface RawMaterialFields {
  name: string;
  category: number;
  yield_rate: number;
  specs: string;
}

export default function NewMaterialForm() {
  const [, navigate] = useLocation();
  const { trigger: createMaterial } = useMaterialCreate();
  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  const [form] = Form.useForm();

  const columns: ColumnsType<{ key: number | string }> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'name']}
          rules={[{ required: true, message: 'Please input name' }]}
          className="mb-0!"
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
          className="mb-0!"
        >
          <Select
            placeholder="Select category"
            className="w-full"
            options={categoryOptions}
            loading={isLoadingCategories}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Yield Rate',
      dataIndex: 'yield_rate',
      key: 'yield_rate',
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'yield_rate']}
          rules={[
            {
              required: true,
              message: 'Please input yield rate',
            },
          ]}
          className="mb-0!"
        >
          <Input placeholder="e.g. 0.8" />
        </Form.Item>
      ),
    },
    {
      title: 'Specs',
      dataIndex: 'specs',
      key: 'specs',
      render: (_, _record, index) => (
        <Form.Item name={[index, 'specs']} className="mb-0!">
          <Input placeholder="e.g. chunk, slice, shred" />
        </Form.Item>
      ),
    },
  ];

  const onFinish = async (values: { items: RawMaterialFields[] }) => {
    const data = values.items.map((item) => ({
      name: item.name,
      category: item.category,
      yield_rate: item.yield_rate,
      specs: item.specs
        .split(',')
        .map((spec) => ({ method_name: spec.trim() })),
    }));
    await createMaterial(data);
    navigate('/material');
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
                  className="mt-1"
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
