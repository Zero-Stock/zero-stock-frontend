import { useMemo, useState } from 'react';
import { App, Button, Modal, Select, Table, Typography } from 'antd';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useProcurementList } from '../hooks/useProcurementList';
import { useProcurementGenerate } from '../hooks/useProcurementGenerate';
import { useProcurementSheet } from '../hooks/useProcurementSheet';
import { useProcurementSubmit } from '../hooks/useProcurementSubmit';
import { useProcurementAssignSuppliers } from '../hooks/useProcurementAssignSuppliers';
import type {
  ProcurementPreviewSchema,
  ProcurementSheetItemSchema,
} from '@/shared/types/schema';
import ProcurementSupplierEditModal from './ProcurementSupplierEditModal';
import { handleExportPdf } from './handleExportPdf';

const { Title } = Typography;

const formatKg = (value: number | null | undefined) =>
  value == null ? '-' : (value / 1000).toFixed(2);

const getTotalPrice = (record: ProcurementSheetItemSchema) => {
  if (record.supplier_price == null) return null;

  const qty = record.demand_unit_qty || record.demand_g || 0;
  return record.supplier_price * Math.ceil(qty);
};

export default function ProcurementList() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const date = useDateStore((state) => state.date);
  const [generatedProcurement, setGeneratedProcurement] = useState<{
    date: string;
    id: number;
  } | null>(null);
  const [editingRow, setEditingRow] =
    useState<ProcurementSheetItemSchema | null>(null);
  const [editingProcurementItem, setEditingProcurementItem] =
    useState<ProcurementPreviewSchema | null>(null);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const {
    procurements,
    isLoading: isLoadingList,
    mutate: mutateList,
  } = useProcurementList({ date });

  const procurementId =
    generatedProcurement?.date === date ? generatedProcurement.id : undefined;

  const {
    items: sheetItems,
    isLoading: isLoadingSheet,
    mutate: mutateSheet,
  } = useProcurementSheet(procurementId);

  const { trigger: generateTrigger } = useProcurementGenerate();
  const { trigger: submitTrigger } = useProcurementSubmit();
  const { trigger: assignSuppliersTrigger } = useProcurementAssignSuppliers();

  const procurementRows = useMemo<ProcurementSheetItemSchema[]>(() => {
    if (sheetItems.length) return sheetItems;

    return procurements.map((item) => ({
      material_id: item.material_id,
      name: item.material_name,
      category: item.material_category ?? '',
      demand_g: item.demand_g,
      demand_unit_qty: item.demand_special_unit,
      stock_g: item.stock_g,
      stock_unit_qty: item.stock_special_unit,
      purchase_g: item.required_g,
      purchase_unit_qty: item.required_special_unit,
      supplier: item.supplier_name,
      supplier_unit_name: item.supplier_unit,
      supplier_g_per_unit: null,
      supplier_price: item.supplier_price,
    }));
  }, [procurements, sheetItems]);

  const categoryOptions = useMemo(() => {
    return Array.from(
      new Set(procurementRows.map((item) => item.category).filter(Boolean)),
    )
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({
        label: category,
        value: category,
      }));
  }, [procurementRows]);

  const filteredProcurementRows = useMemo(() => {
    if (!selectedCategory) return procurementRows;
    return procurementRows.filter((item) => item.category === selectedCategory);
  }, [procurementRows, selectedCategory]);

  const handleGenerate = async () => {
    try {
      const result = await generateTrigger({ date });
      setGeneratedProcurement({ date, id: result.id });
      message.success(t('procurementGenerateSuccess'));
      await Promise.all([mutateList(), mutateSheet()]);
    } catch (error: Error | unknown) {
      message.error(
        error instanceof Error ? error.message : t('procurementGenerateFailed'),
      );
    }
  };

  const onExportPdf = () => {
    handleExportPdf({
      date,
      items: sheetItems.length ? sheetItems : procurementRows,
      t,
      message,
      generateTrigger,
      setProcurementId: (id) => setGeneratedProcurement({ date, id }),
      mutateList,
      mutateSheet,
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
        } catch (error) {
          if (!(error instanceof Error)) return;
          message.error(error.message);
        }
      },
    });
  };

  const handleOpenSupplierModal = (record: ProcurementSheetItemSchema) => {
    const matchedProcurementItem =
      procurements.find((item) => item.material_id === record.material_id) ??
      procurements.find((item) => item.material_name === record.name) ??
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

      await Promise.all([mutateList(), mutateSheet()]);
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const columns: ColumnsType<ProcurementSheetItemSchema> = [
    {
      title: t('procurementColName'),
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: t('procurementColCategory'),
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: t('procurementColStockKg'),
      dataIndex: 'stock_g',
      key: 'stock_g',
      width: 100,
      sorter: (a, b) => a.stock_g - b.stock_g,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('procurementColDemandKg'),
      dataIndex: 'demand_g',
      key: 'demand_g',
      width: 100,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('procurementColDemandUnit'),
      dataIndex: 'demand_unit_qty',
      key: 'demand_unit_qty',
      width: 120,
    },
    {
      title: t('procurementColPurchaseKg'),
      dataIndex: 'purchase_g',
      key: 'purchase_g',
      width: 120,
      sorter: (a, b) => a.purchase_g - b.purchase_g,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('procurementColPurchaseUnit'),
      dataIndex: 'purchase_unit_qty',
      key: 'purchase_unit_qty',
      width: 120,
    },
    {
      title: t('commonSupplier'),
      dataIndex: 'supplier',
      key: 'supplier',
      width: 160,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('procurementColSupplierUnit'),
      dataIndex: 'supplier_unit_name',
      key: 'supplier_unit_name',
      width: 80,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('procurementColSupplierPrice'),
      dataIndex: 'supplier_price',
      key: 'supplier_price',
      width: 90,
      render: (value: number | null) =>
        value != null ? `${t('commonCurrencySymbol')}${value.toFixed(2)}` : '-',
    },
    {
      title: t('commonTotalPrice'),
      key: 'total_price',
      width: 100,
      sorter: (a, b) => (getTotalPrice(a) ?? 0) - (getTotalPrice(b) ?? 0),
      render: (_, record) => {
        const total = getTotalPrice(record);
        if (total == null) return '-';

        return total > 0
          ? `${t('commonCurrencySymbol')}${total.toFixed(2)}`
          : `${t('commonCurrencySymbol')}0.00`;
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

  const hasProcurement = procurementRows.length > 0;
  const loading = isLoadingList || isLoadingSheet;

  return (
    <div>
      <div className="print-header mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('navProcurementOrder')}
        </Title>
        <div className="no-print flex items-center gap-3">
          <Button onClick={handleGenerate}>
            {hasProcurement ? t('commonRegenerate') : t('procurementGenerate')}
          </Button>

          <Button onClick={onExportPdf} disabled={!hasProcurement}>
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

      <div className="no-print mb-4 flex items-center gap-4">
        <Select
          allowClear
          showSearch={{ optionFilterProp: 'label' }}
          placeholder={t('procurementFilterCategory')}
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
          className="w-60"
        />
      </div>

      <div id="procurement-print-area">
        <Table
          rowKey={(record, index) =>
            String(record.material_id ?? record.name ?? index)
          }
          columns={columns}
          dataSource={filteredProcurementRows}
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
        rawMaterialId={editingProcurementItem?.material_id}
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
