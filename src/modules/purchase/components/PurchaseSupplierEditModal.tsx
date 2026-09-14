import { Modal, Radio, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useSupplierMaterials } from '@/modules/supplier/hooks/useSupplierMaterials';
import type {
  PurchaseOrderItemSchema,
  SupplierMaterialPreviewSchema,
} from '@/shared/types/schema';

interface PurchaseSupplierEditModalProps {
  open: boolean;
  purchaseItem: PurchaseOrderItemSchema | null;
  onCancel: () => void;
  onSave: (supplierMaterialId: number | null) => Promise<void> | void;
}

function sameNumber(
  left: number | string | null,
  right: number | string | null,
) {
  if (left == null || right == null) return left == right;
  return Number(left) === Number(right);
}

export default function PurchaseSupplierEditModal({
  open,
  purchaseItem,
  onCancel,
  onSave,
}: PurchaseSupplierEditModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { materials, isLoading } = useSupplierMaterials(
    purchaseItem?.material_id
      ? { material_id: purchaseItem.material_id }
      : undefined,
  );

  const selectedSupplierMaterialId = useMemo(() => {
    if (!purchaseItem?.supplier_id) return null;

    const exactMatch = materials.find((material) => {
      return (
        material.supplier_id === purchaseItem.supplier_id &&
        material.unit_name === purchaseItem.supplier_unit &&
        sameNumber(material.price_per_unit, purchaseItem.supplier_price)
      );
    });
    if (exactMatch) return exactMatch.id;

    return (
      purchaseItem.available_suppliers.find(
        (supplier) => supplier.supplier_id === purchaseItem.supplier_id,
      )?.supplier_material_id ?? null
    );
  }, [materials, purchaseItem]);

  useEffect(() => {
    if (open) {
      setSelectedId(selectedSupplierMaterialId);
    }
  }, [open, selectedSupplierMaterialId]);

  const handleOk = async () => {
    try {
      setIsSaving(true);
      await onSave(selectedId);
    } finally {
      setIsSaving(false);
    }
  };

  const columns: ColumnsType<SupplierMaterialPreviewSchema> = [
    {
      title: '',
      key: 'select',
      width: 60,
      render: (_, record) => (
        <Radio
          checked={selectedId === record.id}
          onChange={() => setSelectedId(record.id)}
        />
      ),
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 180,
    },
    {
      title: '供应商单价',
      dataIndex: 'price_per_unit',
      key: 'price_per_unit',
      width: 120,
      render: (value: string | null) =>
        value != null ? `${'¥'}${Number(value).toFixed(2)}` : '-',
    },
    {
      title: '供应商单位',
      dataIndex: 'unit_name',
      key: 'unit_name',
      width: 120,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: 'g/unit',
      dataIndex: 'g_per_unit',
      key: 'g_per_unit',
      width: 120,
      render: (value: string) => value ?? '-',
    },
  ];

  return (
    <Modal
      title={`${'编辑供应商'} - ${purchaseItem?.material_name ?? ''}`}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={'保存'}
      cancelText={'取消'}
      confirmLoading={isSaving}
      width={760}
      destroyOnHidden
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={materials}
        loading={isLoading}
        pagination={false}
        tableLayout="fixed"
        locale={{ emptyText: '暂无可选供应商' }}
        onRow={(record) => ({
          onClick: () => setSelectedId(record.id),
        })}
      />
    </Modal>
  );
}
