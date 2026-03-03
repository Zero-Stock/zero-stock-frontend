import { Button, Input, Space, Table, Typography, message } from 'antd';
import { useMemo, useState } from 'react';

import { useSupplierMaterials } from '../hooks/useSupplierMaterials';
import { useSupplierMaterialCreate } from '../hooks/useSupplierMaterialCreate';
import type { SupplierMaterialDto } from '../dtos/supplierMaterial.dto';
import SupplierMaterialUpsertModal from './SupplierMaterialUpsertModal';

const { Title } = Typography;

export default function SupplierMaterialTable({
  supplierId,
}: {
  supplierId: number;
}) {
  const [keyword, setKeyword] = useState('');

  const { materials, isLoading, mutate } = useSupplierMaterials(supplierId);
  const { trigger: createTrigger } = useSupplierMaterialCreate(supplierId);

  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return materials;
    return materials.filter((m) => {
      return (
        String(m.raw_material).toLowerCase().includes(kw) ||
        String(m.raw_material_name ?? '')
          .toLowerCase()
          .includes(kw)
      );
    });
  }, [materials, keyword]);

  const existingRawMaterialIds = useMemo(
    () => new Set(materials.map((m) => m.raw_material)),
    [materials],
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
    {
      title: 'Raw Material ID',
      dataIndex: 'raw_material',
      key: 'raw_material',
      width: 140,
      sorter: (a: SupplierMaterialDto, b: SupplierMaterialDto) =>
        a.raw_material - b.raw_material,
      defaultSortOrder: 'ascend' as const,
    },
    { title: 'Name', dataIndex: 'raw_material_name', key: 'raw_material_name' },
    { title: 'Unit', dataIndex: 'unit_name', key: 'unit_name', width: 120 },
    {
      title: 'kg/unit',
      dataIndex: 'kg_per_unit',
      key: 'kg_per_unit',
      width: 120,
    },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 120 },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    // ⚠️ 文档没写 PATCH/DELETE，所以这里先不放 Edit/Delete
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
          Supplier Materials
        </Title>

        <Space>
          <Input.Search
            allowClear
            placeholder="Search by Raw Material ID or Name"
            style={{ width: 320 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button
            type="primary"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Add Material
          </Button>
        </Space>
      </Space>

      <Table<SupplierMaterialDto>
        rowKey="id"
        columns={columns as any}
        dataSource={filtered}
        loading={isLoading}
        pagination={{ pageSize: 8 }}
      />

      <SupplierMaterialUpsertModal
        open={modalOpen}
        existingRawMaterialIds={existingRawMaterialIds}
        onCancel={() => setModalOpen(false)}
        onSave={async (payload) => {
          await createTrigger(payload);
          message.success('Added');
          setModalOpen(false);
          mutate(); // ✅ 刷新 materials
        }}
      />
    </div>
  );
}
