import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Table, Typography, message } from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/i18n/LanguageContext';
import { useProcurementList } from '../hooks/useProcurementList';
import { useProcurementGenerate } from '../hooks/useProcurementGenerate';
import { useProcurementSheet } from '../hooks/useProcurementSheet';
import { useProcurementSubmit } from '../hooks/useProcurementSubmit';
import { useProcurementItems } from '../hooks/useProcurementItems';
import { useProcurementAssignSuppliers } from '../hooks/useProcurementAssignSuppliers';
import type { ProcurementSheetItemDto } from '../dtos/procurementSheetItem.dto';
import type { ProcurementItemDto } from '../dtos/procurementItem.dto';
import ProcurementSupplierEditModal from './ProcurementSupplierEditModal';

const { Title } = Typography;

export default function ProcurementList() {
  const { t } = useTranslation();
  const [date] = useState(dayjs().format('YYYY-MM-DD'));
  const [procurementId, setProcurementId] = useState<number | undefined>(
    undefined,
  );
  const [editingRow, setEditingRow] = useState<ProcurementSheetItemDto | null>(
    null,
  );
  const [editingProcurementItem, setEditingProcurementItem] =
    useState<ProcurementItemDto | null>(null);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);

  const {
    procurements,
    isLoading: isLoadingList,
    mutate: mutateList,
  } = useProcurementList({
    date,
  });

  const {
    items: sheetItems,
    isLoading: isLoadingSheet,
    mutate: mutateSheet,
  } = useProcurementSheet(procurementId);

  const {
    items: procurementItems,
    isLoading: isLoadingProcurementItems,
    mutate: mutateProcurementItems,
  } = useProcurementItems(procurementId);

  const { trigger: generateTrigger } = useProcurementGenerate();
  const { trigger: submitTrigger } = useProcurementSubmit();
  const { trigger: assignSuppliersTrigger } = useProcurementAssignSuppliers();

  const currentProcurement = useMemo(() => {
    return procurements[0];
  }, [procurements]);

  useEffect(() => {
    if (currentProcurement?.id) {
      setProcurementId(currentProcurement.id);
    } else {
      setProcurementId(undefined);
    }
  }, [currentProcurement]);

  const handleGenerate = async () => {
    try {
      const result = await generateTrigger({ date });
      setProcurementId(result.id);
      message.success('Procurement generated');
      await mutateList();
      await mutateSheet();
      await mutateProcurementItems();
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const handleExportPdf = () => {
    Modal.confirm({
      title: 'Export PDF',
      content:
        'Do you want to regenerate the procurement first to make sure the exported sheet is up to date?',
      okText: 'Regenerate First',
      cancelText: 'Export Directly',
      onOk: async () => {
        try {
          const result = await generateTrigger({ date });
          setProcurementId(result.id);
          await mutateList();
          await mutateSheet();
          await mutateProcurementItems();
          message.success('Procurement regenerated');
          setTimeout(() => {
            window.print();
          }, 300);
        } catch (error) {
          if (!(error instanceof Error)) return;
          message.error(error.message);
        }
      },
      onCancel: () => {
        window.print();
      },
    });
  };

  const handleSubmit = async () => {
    if (!procurementId) {
      message.warning('Please generate procurement first');
      return;
    }

    Modal.confirm({
      title: 'Submit Procurement',
      content: 'Are you sure you want to submit this procurement order?',
      okText: 'Submit',
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await submitTrigger(procurementId);
          message.success('Procurement submitted');
          await mutateList();
          await mutateSheet();
          await mutateProcurementItems();
        } catch (error) {
          if (!(error instanceof Error)) return;
          message.error(error.message);
        }
      },
    });
  };

  const handleOpenSupplierModal = (record: ProcurementSheetItemDto) => {
    if (!procurementItems.length) {
      message.warning('Procurement item data is not ready yet');
      return;
    }

    const matchedProcurementItem =
      procurementItems.find((item) => item.raw_material_name === record.name) ??
      null;

    if (!matchedProcurementItem) {
      message.error('Cannot find matching procurement item');
      return;
    }

    setEditingRow(record);
    setEditingProcurementItem(matchedProcurementItem);
    setSupplierModalOpen(true);
  };

  const handleSaveSupplier = async (supplierMaterialId: number | null) => {
    if (!editingProcurementItem?.id) {
      message.error('Missing procurement item id');
      return;
    }

    try {
      await assignSuppliersTrigger({
        assignments: [
          {
            item_id: editingProcurementItem.id,
            supplier_material_id: supplierMaterialId,
          },
        ],
      });

      message.success('Supplier updated');

      setSupplierModalOpen(false);
      setEditingRow(null);
      setEditingProcurementItem(null);

      await mutateSheet();
      await mutateProcurementItems();
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const columns: ColumnsType<ProcurementSheetItemDto> = [
    {
      title: '品名',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: '规格/类别',
      dataIndex: 'category',
      key: 'category',
      width: 140,
    },
    {
      title: '需求(kg)',
      dataIndex: 'demand_kg',
      key: 'demand_kg',
      width: 120,
    },
    {
      title: '需求(特殊单位)',
      dataIndex: 'demand_unit_qty',
      key: 'demand_unit_qty',
      width: 140,
    },
    {
      title: '库存(kg)',
      dataIndex: 'stock_kg',
      key: 'stock_kg',
      width: 120,
    },
    {
      title: '库存(特殊单位)',
      dataIndex: 'stock_unit_qty',
      key: 'stock_unit_qty',
      width: 140,
    },
    {
      title: '采购需求(kg)',
      dataIndex: 'purchase_kg',
      key: 'purchase_kg',
      width: 140,
    },
    {
      title: '采购需求(特殊单位)',
      dataIndex: 'purchase_unit_qty',
      key: 'purchase_unit_qty',
      width: 160,
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 180,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: '供应商单位',
      dataIndex: 'supplier_unit_name',
      key: 'supplier_unit_name',
      width: 120,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          className="p-0!"
          onClick={() => handleOpenSupplierModal(record)}
        >
          {t('edit')}
        </Button>
      ),
    },
  ];

  const hasProcurement = Boolean(procurementId);
  const loading = isLoadingList || isLoadingSheet || isLoadingProcurementItems;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Title level={2} className="mb-0!">
          Procurement Order
        </Title>

        <div className="flex items-center gap-3">
          <Button onClick={handleGenerate}>
            {hasProcurement ? 'Regenerate' : 'Generate'}
          </Button>

          <Button onClick={handleExportPdf} disabled={!procurementId}>
            Export PDF
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!procurementId}
          >
            Submit
          </Button>
        </div>
      </div>

      <Table
        rowKey={(record, index) =>
          String(record.item_id ?? record.name ?? index)
        }
        columns={columns}
        dataSource={sheetItems}
        loading={loading}
        pagination={{ pageSize: 10 }}
        tableLayout="fixed"
        locale={{
          emptyText: hasProcurement
            ? '暂无采购单明细'
            : '暂无采购单，请先点击 Generate',
        }}
        scroll={{ x: 1750 }}
      />

      <ProcurementSupplierEditModal
        open={supplierModalOpen}
        materialName={editingRow?.name ?? ''}
        rawMaterialId={editingProcurementItem?.raw_material}
        selectedSupplierMaterialId={null}
        onCancel={() => {
          setSupplierModalOpen(false);
          setEditingRow(null);
          setEditingProcurementItem(null);
        }}
        onSave={handleSaveSupplier}
      />
    </div>
  );
}
