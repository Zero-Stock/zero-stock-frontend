import { App, Button, Checkbox, Input, Space, Table, Typography } from 'antd';
import { useState } from 'react';

import { useSupplierMaterials } from '../hooks/useSupplierMaterials';
import { useSupplierMaterialUpdate } from '../hooks/useSupplierMaterialUpdate';
import type { ColumnsType } from 'antd/es/table';
import { useSupplierMaterialDelete } from '../hooks/useSupplierMaterialDelete';
import type { SupplierMaterialPreviewSchema } from '@/shared/types/schema';
import { gramsToKg } from '../utils/supplierMaterialUnit';

const { Title } = Typography;

interface SupplierMaterialTableProps {
  supplierId: number;
}

export default function SupplierMaterialTable(
  props: SupplierMaterialTableProps,
) {
  const { supplierId } = props;
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');

  const { materials, isLoading, mutate } = useSupplierMaterials({
    supplier_id: supplierId,
  });
  const { trigger: updateTrigger } = useSupplierMaterialUpdate();
  const { trigger: deleteTrigger } = useSupplierMaterialDelete();

  const columns: ColumnsType<SupplierMaterialPreviewSchema> = [
    {
      title: '名称',
      dataIndex: 'material_name',
      key: 'material_name',
      width: '15%',
    },
    {
      title: '单位',
      dataIndex: 'unit_name',
      key: 'unit_name',
      width: '10%',
    },
    {
      title: '千克/单位',
      dataIndex: 'g_per_unit',
      key: 'g_per_unit',
      width: '15%',
      render: (value: SupplierMaterialPreviewSchema['g_per_unit']) =>
        `${gramsToKg(value)} kg`,
    },
    {
      title: '单位价格',
      dataIndex: 'price_per_unit',
      key: 'price_per_unit',
      width: '15%',
    },
    { title: '备注', dataIndex: 'notes', key: 'notes' },
    {
      title: '默认供应商',
      key: 'isDefaultSupplierMaterial',
      width: '10%',
      align: 'center',
      render: (_, record: SupplierMaterialPreviewSchema) => (
        <Checkbox
          checked={record.isDefaultSupplierMaterial}
          onChange={async (e) => {
            const checked = e.target.checked;
            try {
              await updateTrigger(record.supplier_id, {
                material_id: record.material_id,
                unit_name: record.unit_name,
                g_per_unit: record.g_per_unit,
                price_per_unit: record.price_per_unit,
                notes: record.notes,
                is_default: checked,
              });
              message.success(
                checked ? '默认供应商设置成功' : '默认供应商取消成功',
              );
              mutate();
            } catch (error) {
              if (error instanceof Error) {
                message.error(error.message);
              }
            }
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: '10%',
      render: (_, record: SupplierMaterialPreviewSchema) => (
        <Space size="small">
          <Button
            type="link"
            danger
            onClick={() => {
              console.log('delete', record);
              deleteTrigger(record.id);
              mutate();
            }}
            className="p-0!"
          >
            {'删除'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          {'供应商食材'}
        </Title>

        <Space>
          <Input.Search
            allowClear
            placeholder={'按食材 ID 或名称搜索'}
            style={{ width: 320 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Space>
      </Space>

      <Table<SupplierMaterialPreviewSchema>
        rowKey="id"
        columns={columns}
        dataSource={materials}
        loading={isLoading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}
