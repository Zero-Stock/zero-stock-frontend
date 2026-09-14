import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, InputNumber, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation } from 'wouter';
import { useMaterialCreate } from '../hooks/useMaterialCreate';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useMaterialList } from '../hooks/useMaterialList';
import {
  isValidYieldRatePercent,
  percentYieldRateToDecimal,
} from '../utils/yieldRate';

interface MaterialFields {
  name: string;
  category_id: number;
  yield_rate: string;
  processing?: string[];
}

function normalizeMaterialName(name: string) {
  return name.trim().toLocaleLowerCase();
}

export default function NewMaterialForm() {
  const { message } = App.useApp();
  const [, navigate] = useLocation();
  const { trigger: createMaterial } = useMaterialCreate();
  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();
  const { materials: existingMaterials, isLoading: isLoadingMaterials } =
    useMaterialList({ page_size: 10000 });

  const [form] = Form.useForm();

  const onFinish = async (values: { items: MaterialFields[] }) => {
    const existingNames = new Set(
      existingMaterials.map((material) => normalizeMaterialName(material.name)),
    );
    const submittedNameCounts = values.items.reduce<Record<string, number>>(
      (counts, item) => {
        const name = normalizeMaterialName(item.name);
        counts[name] = (counts[name] ?? 0) + 1;
        return counts;
      },
      {},
    );
    const duplicateFieldErrors = values.items.flatMap((item, index) => {
      const name = normalizeMaterialName(item.name);
      const isDuplicate =
        existingNames.has(name) || submittedNameCounts[name] > 1;

      if (!isDuplicate) return [];

      return [
        {
          name: ['items', index, 'name'],
          errors: ['食材名称重复'],
        },
      ];
    });

    if (duplicateFieldErrors.length > 0) {
      form.setFields(duplicateFieldErrors);
      return;
    }

    const data = values.items.map((item) => ({
      name: item.name,
      category_id: item.category_id,
      yield_rate: percentYieldRateToDecimal(item.yield_rate),
      processing: item.processing ?? [],
    }));

    try {
      await createMaterial(data);
      message.success('创建食材成功');
      navigate('/material');
    } catch (error) {
      const details =
        error instanceof Error && 'details' in error
          ? String(error.details)
          : undefined;
      message.error(details || '创建食材失败');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={{ items: [{}] }}>
      <Form.List name="items">
        {(fields, { add, remove }) => {
          const columns: ColumnsType<(typeof fields)[number]> = [
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              render: (_, _record, index) => (
                <Form.Item
                  name={[fields[index].name, 'name']}
                  rules={[{ required: true, message: '请输入名称' }]}
                  className="mb-0!"
                >
                  <Input placeholder={'输入食材名称'} />
                </Form.Item>
              ),
            },
            {
              title: '类别',
              dataIndex: 'category_id',
              key: 'category_id',
              width: 200,
              render: (_, _record, index) => (
                <Form.Item
                  name={[fields[index].name, 'category_id']}
                  rules={[{ required: true, message: '请选择类别' }]}
                  className="mb-0!"
                >
                  <Select
                    placeholder={'选择类别'}
                    className="w-full"
                    options={categoryOptions}
                    loading={isLoadingCategories}
                  />
                </Form.Item>
              ),
            },
            {
              title: '出成率',
              dataIndex: 'yield_rate',
              width: 200,
              key: 'yield_rate',
              render: (_, _record, index) => (
                <Form.Item
                  name={[fields[index].name, 'yield_rate']}
                  rules={[
                    {
                      required: true,
                      message: '请输入出成率',
                    },
                    {
                      validator: (_, value: string | undefined) => {
                        if (isValidYieldRatePercent(value)) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error('出成率必须在 0 到 100 之间'),
                        );
                      },
                    },
                  ]}
                  className="mb-0!"
                >
                  <InputNumber
                    stringMode
                    min={0}
                    max={100}
                    step="1"
                    suffix="%"
                    placeholder={'例如：80'}
                    className="w-full!"
                  />
                </Form.Item>
              ),
            },
            {
              title: '加工规格',
              dataIndex: 'processing',
              key: 'processing',
              render: (_, _record, index) => (
                <Form.Item
                  name={[fields[index].name, 'processing']}
                  className="mb-0!"
                >
                  <Select
                    mode="tags"
                    dropdownStyle={{ display: 'none' }}
                    placeholder={'例如：块、片、丝'}
                    className="w-full"
                  />
                </Form.Item>
              ),
            },
            {
              title: '',
              key: 'action',
              width: 100,
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
            <>
              <Table
                dataSource={fields}
                columns={columns}
                pagination={false}
                rowKey="key"
                tableLayout="fixed"
                footer={() => (
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    className="mt-1"
                  >
                    {'新增一行'}
                  </Button>
                )}
              />
              <div className="mt-4 flex justify-end gap-3">
                <Button onClick={() => navigate('/material')}>{'取消'}</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoadingMaterials}
                >
                  {'提交'}
                </Button>
              </div>
            </>
          );
        }}
      </Form.List>
    </Form>
  );
}
