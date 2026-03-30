import { Modal, Radio, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useSupplierMaterials } from '@/modules/supplier/hooks/useSupplierMaterials';
import type { SupplierMaterialDto } from '@/modules/supplier/dtos/supplierMaterial.dto';

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
    rawMaterialId ? { raw_material: rawMaterialId } : undefined,
  );

  useEffect(() => {
    setSelectedId(selectedSupplierMaterialId);
  }, [selectedSupplierMaterialId, open]);

  const columns: ColumnsType<SupplierMaterialDto> = [
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
      dataIndex: 'price',
      key: 'price',
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
      title: 'kg/unit',
      dataIndex: 'kg_per_unit',
      key: 'kg_per_unit',
      width: 120,
      render: (value: string) => value ?? '-',
    },
  ];

  return (
    <Modal
      title={`Edit Supplier - ${materialName}`}
      open={open}
      onCancel={onCancel}
      onOk={() => onSave(selectedId)}
      okText={t('save')}
      cancelText={t('cancel')}
      width={760}
      destroyOnHidden
    >
      <Space direction="vertical" size={12} className="w-full">
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
