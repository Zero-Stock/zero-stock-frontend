import { Button, Input, Space, Table, Typography, message } from 'antd';
import { useMemo, useState } from 'react';

import { useSupplierMaterials } from '../hooks/useSupplierMaterials';
import { useSupplierMaterialCreate } from '../hooks/useSupplierMaterialCreate';
import { useSupplierMaterialUpdate } from '../hooks/useSupplierMaterialUpdate';
import type { SupplierMaterialDto } from '../dtos/supplierMaterial.dto';
import SupplierMaterialUpsertModal from './SupplierMaterialUpsertModal';
import { useTranslation } from '@/shared/i18n/LanguageContext';
import type { ColumnsType } from 'antd/es/table';
import { useSupplierMaterialDelete } from '../hooks/useSupplierMaterialDelete';

const { Title } = Typography;

interface SupplierMaterialTableProps {
  supplierId: number;
}

export default function SupplierMaterialTable(
  props: SupplierMaterialTableProps,
) {
  const { supplierId } = props;
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');

  const { materials, isLoading, mutate } = useSupplierMaterials({
    supplier: supplierId,
  });
  const { trigger: createTrigger } = useSupplierMaterialCreate();
  const { trigger: updateTrigger } = useSupplierMaterialUpdate();
  const { trigger: deleteTrigger } = useSupplierMaterialDelete();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] =
    useState<SupplierMaterialDto | null>(null);

  const existingRawMaterialIds = useMemo(
    () => new Set(materials.map((m) => m.raw_material)),
    [materials],
  );

  const columns: ColumnsType<SupplierMaterialDto> = [
    {
      title: t('supplierMaterialName'),
      dataIndex: 'raw_material_name',
      key: 'raw_material_name',
      width: 120,
    },
    {
      title: t('supplierMaterialUnit'),
      dataIndex: 'unit_name',
      key: 'unit_name',
      width: 120,
    },
    {
      title: t('supplierKgPerUnit'),
      dataIndex: 'kg_per_unit',
      key: 'kg_per_unit',
      width: 120,
    },
    { title: t('supplierPrice'), dataIndex: 'price', key: 'price', width: 120 },
    { title: t('supplierMaterialNotes'), dataIndex: 'notes', key: 'notes' },
    {
      title: t('supplierMaterialActions'),
      key: 'actions',
      width: 200,
      render: (_, record: SupplierMaterialDto) => (
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

      <Table<SupplierMaterialDto>
        rowKey="id"
        columns={columns as any}
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
              id: payload.id,
              ...payload,
              supplier: supplierId,
            });
            message.success(t('supplierMaterialUpdated'));
          } else {
            await createTrigger({ ...payload, supplier: supplierId });
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
