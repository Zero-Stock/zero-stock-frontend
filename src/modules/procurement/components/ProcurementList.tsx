import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Table, Typography, message } from 'antd';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useProcurementList } from '../hooks/useProcurementList';
import { useProcurementGenerate } from '../hooks/useProcurementGenerate';
import { useProcurementSheet } from '../hooks/useProcurementSheet';
import { useProcurementSubmit } from '../hooks/useProcurementSubmit';
import { useProcurementItems } from '../hooks/useProcurementItems';
import { useProcurementAssignSuppliers } from '../hooks/useProcurementAssignSuppliers';
import type { ProcurementSheetItemDto } from '../dtos/procurementSheetItem.dto';
import type { ProcurementItemDto } from '../dtos/procurementItem.dto';
import ProcurementSupplierEditModal from './ProcurementSupplierEditModal';
import { handleExportPdf } from './handleExportPdf';
import type ApiError from '@/shared/api/apiError';

const { Title } = Typography;

export default function ProcurementList() {
  const { t } = useTranslation();
  const date = useDateStore((state) => state.date);
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
  } = useProcurementList();

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
      message.success(t('procurementGenerateSuccess'));
      await mutateList();
      await mutateSheet();
      await mutateProcurementItems();
    } catch (error: ApiError | Error | unknown) {
      const apiError = error as ApiError;
      message.error(apiError.details.details.date);
    }
  };

  const onExportPdf = () => {
    console.log('--- 打印调试数据 ---', sheetItems);
    handleExportPdf({
      date,
      items: sheetItems,
      t,
      generateTrigger,
      setProcurementId,
      mutateList,
      mutateSheet,
      mutateProcurementItems,
    });
  };

  const handleSubmit = async () => {
    if (!procurementId) {
      message.warning(t('procurementNoData'));
      return;
    }

    Modal.confirm({
      title: t('procurementSubmit'),
      content: t('procurementSubmitConfirm'),
      okText: t('procurementSubmit'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await submitTrigger(procurementId);
          message.success(t('procurementSubmitSuccess'));
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
      message.warning(t('procurementItemDataNotReady'));
      return;
    }

    const matchedProcurementItem =
      procurementItems.find((item) => item.raw_material_name === record.name) ??
      null;

    if (!matchedProcurementItem) {
      message.error(t('procurementItemNotFound'));
      return;
    }

    setEditingRow(record);
    setEditingProcurementItem(matchedProcurementItem);
    setSupplierModalOpen(true);
  };

  const handleSaveSupplier = async (supplierMaterialId: number | null) => {
    if (!editingProcurementItem?.id) {
      message.error(t('procurementMissingItemId'));
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

      message.success(t('procurementSupplierUpdated'));

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
      title: t('procurementColName'),
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: t('procurementColCategory'),
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: t('procurementColDemandKg'),
      dataIndex: 'demand_kg',
      key: 'demand_kg',
      width: 100,
    },
    {
      title: t('procurementColDemandUnit'),
      dataIndex: 'demand_unit_qty',
      key: 'demand_unit_qty',
      width: 120,
    },
    {
      title: t('procurementColStockKg'),
      dataIndex: 'stock_kg',
      key: 'stock_kg',
      width: 120,
    },
    {
      title: t('procurementColStockUnit'),
      dataIndex: 'stock_unit_qty',
      key: 'stock_unit_qty',
      width: 140,
    },
    {
      title: t('procurementColPurchaseKg'),
      dataIndex: 'purchase_kg',
      key: 'purchase_kg',
      width: 140,
    },
    {
      title: t('procurementColPurchaseUnit'),
      dataIndex: 'purchase_unit_qty',
      key: 'purchase_unit_qty',
      width: 160,
    },
    {
      title: t('commonSupplier'),
      dataIndex: 'supplier',
      key: 'supplier',
      width: 180,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('procurementColSupplierUnit'),
      dataIndex: 'supplier_unit_name',
      key: 'supplier_unit_name',
      width: 120,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('procurementColSupplierPrice'),
      dataIndex: 'supplier_price',
      key: 'supplier_price',
      width: 100,
      render: (value: number | null) =>
        value != null ? `${t('commonCurrencySymbol')}${value.toFixed(2)}` : '-',
    },
    {
      title: t('commonTotalPrice'),
      key: 'total_price',
      width: 100,
      render: (_, record) => {
        if (record.supplier_price != null) {
          const qty = record.demand_unit_qty || record.demand_kg || 0;
          const total = record.supplier_price * Math.ceil(qty);
          return total > 0
            ? `${t('commonCurrencySymbol')}${total.toFixed(2)}`
            : `${t('commonCurrencySymbol')}0.00`;
        }
        return '-';
      },
    },
    {
      title: t('commonAction'),
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
      <div className="print-header mb-6 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('navProcurementOrder')}
        </Title>
        <div className="no-print flex items-center gap-3">
          <Button onClick={handleGenerate}>
            {hasProcurement ? t('commonRegenerate') : t('procurementGenerate')}
          </Button>

          <Button onClick={onExportPdf} disabled={!procurementId}>
            {t('commonExportPdf')}
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!procurementId}
          >
            {t('procurementSubmit')}
          </Button>
        </div>
      </div>

      <div id="procurement-print-area">
        <Table
          rowKey={(record, index) => String(record.name ?? index)}
          columns={columns}
          dataSource={sheetItems}
          loading={loading}
          pagination={{ pageSize: 10 }}
          tableLayout="fixed"
          locale={{
            emptyText: hasProcurement
              ? t('procurementNoItems')
              : t('procurementNoData'),
          }}
          scroll={{ x: 1950 }}
        />
      </div>

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
