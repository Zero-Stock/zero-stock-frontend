import { App, Button, Checkbox, Input, Space, Table, Typography } from 'antd';
import { useMemo, useState } from 'react';

import { useSupplierMaterials } from '../hooks/useSupplierMaterials';
import { useSupplierMaterialCreate } from '../hooks/useSupplierMaterialCreate';
import { useSupplierMaterialUpdate } from '../hooks/useSupplierMaterialUpdate';
import SupplierMaterialUpsertModal from './SupplierMaterialUpsertModal';
import { useTranslation } from '@/shared/translation/LanguageContext';
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
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [keyword, setKeyword] = useState('');

  const { materials, isLoading, mutate } = useSupplierMaterials({
    supplier_id: supplierId,
  });
  const { trigger: createTrigger } = useSupplierMaterialCreate();
  const { trigger: updateTrigger } = useSupplierMaterialUpdate();
  const { trigger: deleteTrigger } = useSupplierMaterialDelete();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] =
    useState<SupplierMaterialPreviewSchema | null>(null);

  const existingRawMaterialIds = useMemo(
    () => new Set(materials.map((m) => m.material_id)),
    [materials],
  );

  const columns: ColumnsType<SupplierMaterialPreviewSchema> = [
    {
      title: t('commonName'),
      dataIndex: 'material_name',
      key: 'material_name',
      width: 120,
    },
    {
      title: t('commonUnit'),
      dataIndex: 'unit_name',
      key: 'unit_name',
      width: 120,
    },
    {
      title: t('supplierKgPerUnit'),
      dataIndex: 'g_per_unit',
      key: 'g_per_unit',
      width: 120,
      render: (value: SupplierMaterialPreviewSchema['g_per_unit']) =>
        `${gramsToKg(value)} kg`,
    },
    {
      title: t('supplierPrice'),
      dataIndex: 'price_per_unit',
      key: 'price_per_unit',
      width: 120,
    },
    {
      title: '默认供应商',
      key: 'isDefaultSupplierMaterial',
      width: 120,
      render: (_, record: SupplierMaterialPreviewSchema) => (
        <Checkbox
          checked={record.isDefaultSupplierMaterial}
          onChange={async (e) => {
            const checked = e.target.checked;
            try {
              await updateTrigger({
                id: record.id,
                supplier_id: supplierId,
                material_id: record.material_id,
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
    { title: t('supplierMaterialNotes'), dataIndex: 'notes', key: 'notes' },
    {
      title: t('supplierMaterialActions'),
      key: 'actions',
      width: 200,
      render: (_, record: SupplierMaterialPreviewSchema) => (
        <Space size="small">
          <Button
            type="link"
            onClick={() => {
              setEditingMaterial(record);
              setModalOpen(true);
            }}
            className="p-0!"
          >
            {t('edit')}
          </Button>
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
            {t('delete')}
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
          {t('supplierMaterialsTitle')}
        </Title>

        <Space>
          <Input.Search
            allowClear
            placeholder={t('supplierSearchMaterial')}
            style={{ width: 320 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button
            type="primary"
            onClick={() => {
              setEditingMaterial(null);
              setModalOpen(true);
            }}
          >
            {t('supplierAddMaterial')}
          </Button>
        </Space>
      </Space>

      <Table<SupplierMaterialPreviewSchema>
        rowKey="id"
        columns={columns}
        dataSource={materials}
        loading={isLoading}
        pagination={{ pageSize: 8 }}
      />

      <SupplierMaterialUpsertModal
        open={modalOpen}
        initialValues={editingMaterial}
        existingRawMaterialIds={existingRawMaterialIds}
        onCancel={() => {
          setModalOpen(false);
          setEditingMaterial(null);
        }}
        onSave={async (payload) => {
          if (editingMaterial) {
            await updateTrigger({
              ...payload,
              id: editingMaterial.id,
              supplier_id: supplierId,
            });
            message.success(t('supplierMaterialUpdated'));
          } else {
            await createTrigger({ ...payload, supplier_id: supplierId });
            message.success(t('supplierMaterialAdded'));
          }
          setModalOpen(false);
          setEditingMaterial(null);
          mutate();
        }}
      />
    </div>
  );
}
