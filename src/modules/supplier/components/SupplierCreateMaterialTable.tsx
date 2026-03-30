import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useMaterialList } from '@/modules/material/hooks/useMaterialList';

export default function SupplierCreateMaterialTable() {
  const { materialOptions } = useMaterialList();
  const { t } = useTranslation();

  return (
    <Form.List name="materials">
      {(fields, { add, remove }) => {
        const columns: ColumnsType<any> = [
          {
            title: t('supplierMaterial'),
            dataIndex: 'rawMaterialId',
            key: 'rawMaterialId',
            width: '30%',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'rawMaterialId']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder={t('commonSelectMaterial')}
                  options={materialOptions}
                  showSearch
                />
              </Form.Item>
            ),
          },
          {
            title: t('supplierPrice'),
            dataIndex: 'price',
            key: 'price',
            width: '20%',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'price']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder={t('supplierPricePlaceholder')}
                />
              </Form.Item>
            ),
          },
          {
            title: t('supplierUnitSpec'),
            dataIndex: 'unit',
            key: 'unit',
            width: '20%',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'unit']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder={t('supplierUnitPlaceholder')} />
              </Form.Item>
            ),
          },
          {
            title: t('supplierKgPerUnit'),
            dataIndex: 'kg_per_unit',
            key: 'kg_per_unit',
            width: '20%',
            render: (_, _record, index) => (
              <Form.Item
                name={[fields[index].name, 'kg_per_unit']}
                className="mb-0!"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder={t('supplierKgPlaceholder')}
                />
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
                {t('delete')}
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
                    rawMaterialId: undefined,
                    price: undefined,
                    unit: '',
                    kg_per_unit: undefined,
                  })
                }
                block
                icon={<PlusOutlined />}
                className="mt-1"
              >
                {t('materialAddRow')}
              </Button>
            )}
          />
        );
      }}
    </Form.List>
  );
}
