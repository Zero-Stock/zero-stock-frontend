import { Modal, Radio, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useSupplierMaterials } from '@/modules/supplier/hooks/useSupplierMaterials';
import type { SupplierMaterialPreviewSchema } from '@/shared/types/schema';

const { Text } = Typography;

interface ProcurementSupplierEditModalProps {
  open: boolean;
  materialName: string;
  rawMaterialId?: number;
  selectedSupplierMaterialId: number | null;
  onCancel: () => void;
  onSave: (supplierMaterialId: number | null) => void;
}

export default function ProcurementSupplierEditModal({
  open,
  materialName,
  rawMaterialId,
  selectedSupplierMaterialId,
  onCancel,
  onSave,
}: ProcurementSupplierEditModalProps) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<number | null>(
    selectedSupplierMaterialId,
  );

  const { materials, isLoading } = useSupplierMaterials(
    rawMaterialId ? { material_id: rawMaterialId } : undefined,
  );

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
      title: 'Supplier',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 180,
    },
    {
      title: 'Price',
      dataIndex: 'price_per_unit',
      key: 'price_per_unit',
      width: 120,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: 'Unit',
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
      title={`Edit Supplier - ${materialName}`}
      open={open}
      afterOpenChange={(isOpen) => {
        if (isOpen) {
          setSelectedId(selectedSupplierMaterialId);
        }
      }}
      onCancel={onCancel}
      onOk={() => onSave(selectedId)}
      okText={t('save')}
      cancelText={t('cancel')}
      width={760}
      destroyOnHidden
    >
      <Space orientation="vertical" size={12} className="w-full">
        <Text type="secondary">
          Please select one supplier for this material.
        </Text>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={materials}
          loading={isLoading}
          pagination={false}
          tableLayout="fixed"
          locale={{ emptyText: 'No available suppliers' }}
        />
      </Space>
    </Modal>
  );
}
