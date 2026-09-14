import { useMemo, useState } from 'react';
import { App, Button, Input, Modal, Select, Table, Typography } from 'antd';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ColumnsType } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { formatKg } from '@/shared/utils/format';
import useMaterialCategories from '@/modules/material/hooks/useMaterialCategories';
import { useProcurementList } from '../hooks/useProcurementList';
import { useProcurementGenerate } from '../hooks/useProcurementGenerate';
import { useProcurementSubmit } from '../hooks/useProcurementSubmit';
import { useProcurementAssignSuppliers } from '../hooks/useProcurementAssignSuppliers';
import type { ProcurementPreviewSchema } from '@/shared/types/schema';
import ProcurementSupplierEditModal from './ProcurementSupplierEditModal';
import { handleExportPdf } from './handleExportPdf';

const { Title } = Typography;

const getTotalPrice = (record: ProcurementPreviewSchema) => {
  if (record.supplier_price == null) return null;

  const qty = record.demand_special_unit || record.demand_g || 0;
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
  const [editingProcurementItem, setEditingProcurementItem] =
    useState<ProcurementPreviewSchema | null>(null);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [materialName, setMaterialName] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    key: '',
  });
  const [sortBy, setSortBy] = useState<string>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>();

  const pageKey = JSON.stringify([
    date,
    materialName,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);
  const currentPage = pagination.key === pageKey ? pagination.page : 1;

  const procurementQuery = useMemo(
    () => ({
      needed_date: date,
      page: currentPage,
      page_size: pagination.pageSize,
      material_name: materialName.trim() || undefined,
      category_id: selectedCategory,
      sort_by: sortBy,
      sort_order: sortOrder,
    }),
    [
      date,
      materialName,
      selectedCategory,
      sortBy,
      sortOrder,
      pagination,
      currentPage,
    ],
  );

  const {
    procurements,
    total,
    fetchAll,
    isLoading: isLoadingList,
    mutate: mutateList,
  } = useProcurementList(procurementQuery);

  const procurementId =
    procurements[0]?.procurement_record_id ??
    (generatedProcurement?.date === date ? generatedProcurement.id : undefined);

  const { trigger: generateTrigger } = useProcurementGenerate();
  const { trigger: submitTrigger } = useProcurementSubmit();
  const { trigger: assignSuppliersTrigger } = useProcurementAssignSuppliers();

  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  const handleGenerate = async () => {
    try {
      const result = await generateTrigger({
        needed_date: date,
      });
      setGeneratedProcurement({
        date: result.needed_date,
        id: result.procurement_record_id,
      });
      message.success(t('procurementGenerateSuccess'));
      await mutateList();
    } catch (error: Error | unknown) {
      message.error(
        error instanceof Error ? error.message : t('procurementGenerateFailed'),
      );
    }
  };

  const onExportPdf = async () => {
    try {
      const items = await fetchAll();
      handleExportPdf({
        date,
        items,
        t,
        message,
        generateTrigger,
        setProcurementId: (id) => setGeneratedProcurement({ date, id }),
        mutateList,
      });
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : t('procurementGenerateFailed'),
      );
    }
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
        } catch (error) {
          if (!(error instanceof Error)) return;
          message.error(error.message);
        }
      },
    });
  };

  const handleOpenSupplierModal = (record: ProcurementPreviewSchema) => {
    const matchedProcurementItem =
      procurements.find(
        (item) => item.procurement_item_id === record.procurement_item_id,
      ) ??
      procurements.find((item) => item.material_id === record.material_id) ??
      null;

    if (!matchedProcurementItem) {
      message.error(t('procurementItemNotFound'));
      return;
    }

    setEditingProcurementItem(matchedProcurementItem);
    setSupplierModalOpen(true);
  };

  const handleSaveSupplier = async (supplierMaterialId: number | null) => {
    if (!editingProcurementItem?.procurement_item_id) {
      message.error(t('procurementMissingItemId'));
      return;
    }

    try {
      await assignSuppliersTrigger({
        assignments: [
          {
            procurement_item_id: editingProcurementItem.procurement_item_id,
            supplier_material_id: supplierMaterialId,
          },
        ],
      });

      message.success(t('procurementSupplierUpdated'));

      setSupplierModalOpen(false);
      setEditingProcurementItem(null);

      await mutateList();
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const columns: ColumnsType<ProcurementPreviewSchema> = [
    {
      title: t('procurementColName'),
      dataIndex: 'material_name',
      key: 'material_name',
      width: 100,
    },
    {
      title: t('procurementColCategory'),
      dataIndex: 'material_category',
      key: 'material_category',
      width: 100,
    },
    {
      title: t('procurementColStockKg'),
      dataIndex: 'stock_g',
      key: 'stock_g',
      width: 100,
      sorter: true,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('procurementColDemandKg'),
      dataIndex: 'demand_g',
      key: 'demand_g',
      width: 100,
      sorter: true,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('procurementColDemandUnit'),
      dataIndex: 'demand_special_unit',
      key: 'demand_special_unit',
      width: 120,
    },
    {
      title: t('procurementColPurchaseKg'),
      dataIndex: 'required_g',
      key: 'required_g',
      width: 120,
      sorter: true,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('procurementColPurchaseUnit'),
      dataIndex: 'required_special_unit',
      key: 'required_special_unit',
      width: 120,
    },
    {
      title: t('commonSupplier'),
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 160,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('procurementColSupplierUnit'),
      dataIndex: 'supplier_unit',
      key: 'supplier_unit',
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
      sorter: true,
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

  const hasProcurement = procurements.length > 0;
  const loading = isLoadingList;

  const handleTableChange = (
    nextPage: { current?: number; pageSize?: number },
    __: unknown,
    sorter:
      | SorterResult<ProcurementPreviewSchema>
      | SorterResult<ProcurementPreviewSchema>[],
  ) => {
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setPagination({
      page: nextPage.current ?? 1,
      pageSize: nextPage.pageSize ?? 10,
      key: pageKey,
    });
    setSortBy(activeSorter?.order ? String(activeSorter.columnKey) : undefined);
    setSortOrder(
      activeSorter?.order === 'ascend'
        ? 'asc'
        : activeSorter?.order === 'descend'
          ? 'desc'
          : undefined,
    );
  };

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

      <div className="no-print mb-4 flex flex-wrap items-center gap-4">
        <Input.Search
          allowClear
          placeholder={t('materialSearchName')}
          value={materialName}
          onChange={(event) => {
            setMaterialName(event.target.value);
          }}
          className="w-60!"
        />
        <Select
          allowClear
          showSearch={{ optionFilterProp: 'label' }}
          placeholder={t('procurementFilterCategory')}
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
          loading={isLoadingCategories}
          className="w-60"
        />
      </div>

      <div id="procurement-print-area">
        <Table
          rowKey={(record, index) =>
            String(record.procurement_item_id ?? record.material_id ?? index)
          }
          columns={columns}
          dataSource={procurements}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pagination.pageSize,
            total,
          }}
          onChange={handleTableChange}
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
        procurementItem={editingProcurementItem}
        onCancel={() => {
          setSupplierModalOpen(false);
          setEditingProcurementItem(null);
        }}
        onSave={handleSaveSupplier}
      />
    </div>
  );
}
