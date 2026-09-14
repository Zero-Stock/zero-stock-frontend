import { Modal, Radio, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useSupplierMaterials } from '@/modules/supplier/hooks/useSupplierMaterials';
import type {
  ProcurementPreviewSchema,
  SupplierMaterialPreviewSchema,
} from '@/shared/types/schema';

interface ProcurementSupplierEditModalProps {
  open: boolean;
  procurementItem: ProcurementPreviewSchema | null;
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

export default function ProcurementSupplierEditModal({
  open,
  procurementItem,
  onCancel,
  onSave,
}: ProcurementSupplierEditModalProps) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { materials, isLoading } = useSupplierMaterials(
    procurementItem?.material_id
      ? { material_id: procurementItem.material_id }
      : undefined,
  );

  const selectedSupplierMaterialId = useMemo(() => {
    if (!procurementItem?.supplier_id) return null;

    const exactMatch = materials.find((material) => {
      return (
        material.supplier_id === procurementItem.supplier_id &&
        material.unit_name === procurementItem.supplier_unit &&
        sameNumber(material.price_per_unit, procurementItem.supplier_price)
      );
    });
    if (exactMatch) return exactMatch.id;

    return (
      procurementItem.available_suppliers.find(
        (supplier) => supplier.supplier_id === procurementItem.supplier_id,
      )?.supplier_material_id ?? null
    );
  }, [materials, procurementItem]);

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
      title: t('commonSupplier'),
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 180,
    },
    {
      title: t('procurementColSupplierPrice'),
      dataIndex: 'price_per_unit',
      key: 'price_per_unit',
      width: 120,
      render: (value: string | null) =>
        value != null
          ? `${t('commonCurrencySymbol')}${Number(value).toFixed(2)}`
          : '-',
    },
    {
      title: t('procurementColSupplierUnit'),
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
      title={`${t('procurementEditSupplierTitle')} - ${procurementItem?.material_name ?? ''}`}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={t('save')}
      cancelText={t('cancel')}
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
        locale={{ emptyText: t('procurementNoAvailableSuppliers') }}
        onRow={(record) => ({
          onClick: () => setSelectedId(record.id),
        })}
      />
    </Modal>
  );
}
