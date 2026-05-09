import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation } from 'wouter';
import { useMaterialCreate } from '../hooks/useMaterialCreate';
import useMaterialCategories from '../hooks/useMaterialCategories';
import {
  isValidYieldRatePercent,
  percentYieldRateToDecimal,
} from '../utils/yieldRate';
import { useTranslation } from '@/shared/translation/LanguageContext';

interface RawMaterialFields {
  name: string;
  category_id: number;
  yield_rate: string;
  processing?: string[];
}

export default function NewMaterialForm() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { trigger: createMaterial } = useMaterialCreate();
  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  const [form] = Form.useForm();

  const onFinish = async (values: { items: RawMaterialFields[] }) => {
    const data = values.items.map((item) => ({
      name: item.name,
      category_id: item.category_id,
      yield_rate: percentYieldRateToDecimal(item.yield_rate),
      processing: item.processing ?? [],
    }));
    await createMaterial(data);
    navigate('/material');
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={{ items: [{}] }}>
      <Form.List name="items">
        {(fields, { add, remove }) => {
          const columns: ColumnsType<(typeof fields)[number]> = [
            {
              title: t('commonName'),
              dataIndex: 'name',
              key: 'name',
              render: (_, _record, index) => (
                <Form.Item
                  name={[fields[index].name, 'name']}
                  rules={[
                    { required: true, message: t('materialNameRequired') },
                  ]}
                  className="mb-0!"
                >
                  <Input placeholder={t('materialNamePlaceholder')} />
                </Form.Item>
              ),
            },
            {
              title: t('commonCategory'),
              dataIndex: 'category_id',
              key: 'category_id',
              width: 200,
              render: (_, _record, index) => (
                <Form.Item
                  name={[fields[index].name, 'category_id']}
                  rules={[
                    { required: true, message: t('materialCategoryRequired') },
                  ]}
                  className="mb-0!"
                >
                  <Select
                    placeholder={t('materialCategoryPlaceholder')}
                    className="w-full"
                    options={categoryOptions}
                    loading={isLoadingCategories}
                  />
                </Form.Item>
              ),
            },
            {
              title: t('commonYieldRate'),
              dataIndex: 'yield_rate',
              width: 200,
              key: 'yield_rate',
              render: (_, _record, index) => (
                <Form.Item
                  name={[fields[index].name, 'yield_rate']}
                  rules={[
                    {
                      required: true,
                      message: t('materialYieldRateRequired'),
                    },
                    {
                      validator: (_, value: string | undefined) => {
                        if (isValidYieldRatePercent(value)) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(t('materialYieldRateRange')),
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
                    placeholder={t('materialYieldRatePlaceholder')}
                    className="w-full!"
                  />
                </Form.Item>
              ),
            },
            {
              title: t('commonSpecs'),
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
                    placeholder={t('materialSpecsPlaceholder')}
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
                  {t('delete')}
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
                    {t('materialAddRow')}
                  </Button>
                )}
              />
              <div className="mt-4 flex justify-end gap-3">
                <Button onClick={() => navigate('/material')}>
                  {t('cancel')}
                </Button>
                <Button type="primary" htmlType="submit">
                  {t('materialSubmit')}
                </Button>
              </div>
            </>
          );
        }}
      </Form.List>
    </Form>
  );
}
