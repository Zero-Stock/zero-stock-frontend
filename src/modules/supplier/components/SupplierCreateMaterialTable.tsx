import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import useMaterialOptions from '@/modules/material/hooks/useMaterialOptions';

export default function SupplierCreateMaterialTable() {
  const { materialOptions } = useMaterialOptions();

  return (
    <Form.List name="materials">
      {(fields, { add, remove }) => {
        const columns: ColumnsType<(typeof fields)[number]> = [
          {
            title: '食材',
            dataIndex: 'material_id',
            key: 'material_id',
            width: '15%',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'material_id']}
                rules={[{ required: true, message: '必填' }]}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder={'选择食材'}
                  options={materialOptions}
                  showSearch
                />
              </Form.Item>
            ),
          },
          {
            title: '单位价格',
            dataIndex: 'price_per_unit',
            key: 'price_per_unit',
            width: '15%',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'price_per_unit']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  stringMode
                  min={0}
                  step="0.01"
                  suffix="¥"
                  style={{ width: '100%' }}
                  placeholder={'例如：12.5'}
                />
              </Form.Item>
            ),
          },
          {
            title: '单位（规格）',
            dataIndex: 'unit_name',
            key: 'unit_name',
            width: '15%',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'unit_name']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder={'例如：箱 / 袋'} />
              </Form.Item>
            ),
          },
          {
            title: '千克/单位',
            dataIndex: 'g_per_unit',
            key: 'g_per_unit',
            width: '15%',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'g_per_unit']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  stringMode
                  min={0}
                  step="0.01"
                  suffix="kg"
                  style={{ width: '100%' }}
                  placeholder={'例如：10'}
                />
              </Form.Item>
            ),
          },
          {
            title: '备注',
            dataIndex: 'notes',
            key: 'notes',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'notes']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder={'备注'} />
              </Form.Item>
            ),
          },
          {
            title: '',
            key: 'action',
            width: '10%',
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
                onClick={() =>
                  add({
                    material_id: undefined,
                    price_per_unit: undefined,
                    unit_name: '',
                    g_per_unit: undefined,
                    notes: '',
                  })
                }
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
