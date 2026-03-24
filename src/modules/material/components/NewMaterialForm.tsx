import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation } from 'wouter';
import { useMaterialCreate } from '../hooks/useMaterialCreate';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useTranslation } from '@/shared/i18n/LanguageContext';

interface RawMaterialFields {
  name: string;
  category: number;
  yield_rate: number;
  specs?: string;
}

export default function NewMaterialForm() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { trigger: createMaterial } = useMaterialCreate();
  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  const [form] = Form.useForm();

  const columns: ColumnsType<{ key: number | string }> = [
    {
      title: t('materialNameLabel'),
      dataIndex: 'name',
      key: 'name',
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'name']}
          rules={[{ required: true, message: t('materialNameRequired') }]}
          className="mb-0!"
        >
          <Input placeholder={t('materialNamePlaceholder')} />
        </Form.Item>
      ),
    },
    {
      title: t('materialCategoryLabel'),
      dataIndex: 'category',
      key: 'category',
      width: 200,
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'category']}
          rules={[{ required: true, message: t('materialCategoryRequired') }]}
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
      title: t('materialYieldRateLabel'),
      dataIndex: 'yield_rate',
      width: 200,
      key: 'yield_rate',
      render: (_, _record, index) => (
        <Form.Item
          name={[index, 'yield_rate']}
          rules={[
            {
              required: true,
              message: t('materialYieldRateRequired'),
            },
          ]}
          className="mb-0!"
        >
          <Input
            placeholder={t('materialYieldRatePlaceholder')}
            className="w-full"
          />
        </Form.Item>
      ),
    },
    {
      title: t('materialSpecsLabel'),
      dataIndex: 'specs',
      key: 'specs',
      render: (_, _record, index) => (
        <Form.Item name={[index, 'specs']} className="mb-0!">
          <Input placeholder={t('materialSpecsPlaceholder')} />
        </Form.Item>
      ),
    },
  ];

  const onFinish = async (values: { items: RawMaterialFields[] }) => {
    const data = values.items.map((item) => ({
      name: item.name,
      category: item.category,
      yield_rate: String(item.yield_rate),
      specs: item.specs
        ? item.specs
            .split(',')
            .map((spec) => spec.trim())
            .filter(Boolean)
            .map((method_name) => ({ method_name }))
        : [],
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
            <div className="mt-4 text-right">
              <Button type="primary" htmlType="submit">
                {t('materialSubmit')}
              </Button>
            </div>
          </>
        )}
      </Form.List>
    </Form>
  );
}
