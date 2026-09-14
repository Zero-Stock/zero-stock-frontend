import { useMemo, useState } from 'react';
import {
  App,
  Button,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Typography,
} from 'antd';
import { useLocation } from 'wouter';
import type { ColumnsType } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { formatKg } from '@/shared/utils/format';
import useMaterialCategories from '@/modules/material/hooks/useMaterialCategories';
import { usePurchaseDetail } from '../hooks/usePurchaseDetail';
import { usePurchaseOrderItemList } from '../hooks/usePurchaseOrderItemList';
import { usePurchaseRegenerate } from '../hooks/usePurchaseRegenerate';
import { usePurchaseSubmit } from '../hooks/usePurchaseSubmit';
import { usePurchaseAssignSuppliers } from '../hooks/usePurchaseAssignSuppliers';
import type { PurchaseOrderItemSchema } from '@/shared/types/schema';
import PurchaseSupplierEditModal from './PurchaseSupplierEditModal';
import { handleExportPurchasePdf } from '../utils/handleExportPurchasePdf';

const { Title } = Typography;

const getTotalPrice = (record: PurchaseOrderItemSchema) => {
  if (record.supplier_price == null) return null;

  const qty = record.demand_special_unit || record.demand_g || 0;
  return record.supplier_price * Math.ceil(qty);
};

export default function PurchaseOrder({
  purchaseId: routePurchaseId,
}: {
  purchaseId: string;
}) {
  const [, navigate] = useLocation();
  const id = Number(routePurchaseId);
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [editingPurchaseItem, setEditingPurchaseItem] =
    useState<PurchaseOrderItemSchema | null>(null);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [materialName, setMaterialName] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>();

  const purchaseQuery = useMemo(
    () => ({
      page,
      page_size: pageSize,
      material_name: materialName.trim() || undefined,
      category_id: selectedCategory,
      sort_by: sortBy,
      sort_order: sortOrder,
    }),
    [materialName, selectedCategory, sortBy, sortOrder, page, pageSize],
  );

  const {
    record,
    isLoading: isLoadingDetail,
    mutate: mutateDetail,
  } = usePurchaseDetail(id);

  const {
    items: purchases,
    total,
    isLoading: isLoadingItems,
    mutate: mutateItems,
  } = usePurchaseOrderItemList(id, purchaseQuery);

  const { trigger: generateTrigger } = usePurchaseRegenerate(id);
  const isLoadingList = isLoadingDetail || isLoadingItems;
  const mutateList = () => Promise.all([mutateDetail(), mutateItems()]);
  const date = record?.needed_date ?? '';
  const purchaseId = id;

  const { trigger: submitTrigger } = usePurchaseSubmit();
  const { trigger: assignSuppliersTrigger } = usePurchaseAssignSuppliers(id);

  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  const handleGenerate = async () => {
    try {
      await generateTrigger();
      message.success(t('purchaseGenerateSuccess'));
      await mutateList();
    } catch (error: Error | unknown) {
      message.error(
        error instanceof Error ? error.message : t('purchaseGenerateFailed'),
      );
    }
  };

  const onExportPdf = () => {
    try {
      handleExportPurchasePdf({
        date,
        items: purchases,
        t,
        message,
      });
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : t('purchaseGenerateFailed'),
      );
    }
  };

  const handleSubmit = async () => {
    if (!purchaseId) {
      message.warning(t('purchaseNoData'));
      return;
    }

    Modal.confirm({
      title: t('purchaseSubmit'),
      content: t('purchaseSubmitConfirm'),
      okText: t('purchaseSubmit'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await submitTrigger(purchaseId);
          message.success(t('purchaseSubmitSuccess'));
          await mutateList();
        } catch (error) {
          if (!(error instanceof Error)) return;
          message.error(error.message);
        }
      },
    });
  };

  const handleOpenSupplierModal = (record: PurchaseOrderItemSchema) => {
    const matchedPurchaseItem =
      purchases.find(
        (item) => item.po_item_id === record.po_item_id,
      ) ??
      purchases.find((item) => item.material_id === record.material_id) ??
      null;

    if (!matchedPurchaseItem) {
      message.error(t('purchaseItemNotFound'));
      return;
    }

    setEditingPurchaseItem(matchedPurchaseItem);
    setSupplierModalOpen(true);
  };

  const handleSaveSupplier = async (supplierMaterialId: number | null) => {
    if (!editingPurchaseItem?.po_item_id) {
      message.error(t('purchaseMissingItemId'));
      return;
    }

    try {
      await assignSuppliersTrigger({
        assignments: [
          {
            po_item_id: editingPurchaseItem.po_item_id,
            supplier_material_id: supplierMaterialId,
          },
        ],
      });

      message.success(t('purchaseSupplierUpdated'));

      setSupplierModalOpen(false);
      setEditingPurchaseItem(null);

      await mutateList();
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const columns: ColumnsType<PurchaseOrderItemSchema> = [
    {
      title: t('purchaseColName'),
      dataIndex: 'material_name',
      key: 'material_name',
      width: 100,
    },
    {
      title: t('purchaseColCategory'),
      dataIndex: 'material_category',
      key: 'material_category',
      width: 100,
    },
    {
      title: t('purchaseColStockKg'),
      dataIndex: 'stock_g',
      key: 'stock_g',
      width: 100,
      sorter: true,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('purchaseColDemandKg'),
      dataIndex: 'demand_g',
      key: 'demand_g',
      width: 100,
      sorter: true,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('purchaseColDemandUnit'),
      dataIndex: 'demand_special_unit',
      key: 'demand_special_unit',
      width: 120,
    },
    {
      title: t('purchaseColPurchaseKg'),
      dataIndex: 'required_g',
      key: 'required_g',
      width: 120,
      sorter: true,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('purchaseColPurchaseUnit'),
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
      title: t('purchaseColSupplierUnit'),
      dataIndex: 'supplier_unit',
      key: 'supplier_unit',
      width: 80,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('purchaseColSupplierPrice'),
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
          disabled={!record.editable}
          onClick={() => handleOpenSupplierModal(record)}
        >
          {t('edit')}
        </Button>
      ),
    },
  ];

  const hasPurchase = purchases.length > 0;
  const loading = isLoadingList;

  const handleTableChange = (
    nextPage: { current?: number; pageSize?: number },
    __: unknown,
    sorter:
      | SorterResult<PurchaseOrderItemSchema>
      | SorterResult<PurchaseOrderItemSchema>[],
  ) => {
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    setPage(nextPage.current ?? 1);
    setPageSize(nextPage.pageSize ?? 10);
    setSortBy(activeSorter?.order ? String(activeSorter.columnKey) : undefined);
    setSortOrder(
      activeSorter?.order === 'ascend'
        ? 'asc'
        : activeSorter?.order === 'descend'
          ? 'desc'
          : undefined,
    );
  };

  if (isLoadingList) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (!record) {
    return (
      <div
        role="alert"
        className="flex h-full flex-col items-center justify-center"
      >
        <Title level={3}>{t('purchaseNotFound')}</Title>
        <Button onClick={() => navigate('/procurement/purchase/')}>
          {t('purchaseBack')}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="print-header mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('navPurchaseOrder')} #{id}
        </Title>
        <div className="no-print flex items-center gap-3">
          <Button onClick={handleGenerate} disabled={record?.status !== 'INIT'}>
            {hasPurchase ? t('purchaseRegenerate') : t('purchaseGenerate')}
          </Button>

          <Button onClick={onExportPdf} disabled={!hasPurchase}>
            {t('commonExportPdf')}
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={record?.status !== 'INIT'}
          >
            {t('purchaseSubmit')}
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
            setPage(1);
          }}
          className="w-60!"
        />
        <Select
          allowClear
          showSearch={{ optionFilterProp: 'label' }}
          placeholder={t('purchaseFilterCategory')}
          value={selectedCategory}
          onChange={(value) => {
            setSelectedCategory(value);
            setPage(1);
          }}
          options={categoryOptions}
          loading={isLoadingCategories}
          className="w-60"
        />
      </div>

      <div id="purchase-print-area">
        <Table
          rowKey={(record, index) =>
            String(record.po_item_id ?? record.material_id ?? index)
          }
          columns={columns}
          dataSource={purchases}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          tableLayout="fixed"
          locale={{
            emptyText: hasPurchase ? t('purchaseNoItems') : t('purchaseNoData'),
          }}
          scroll={{ x: 1950 }}
        />
      </div>

      <PurchaseSupplierEditModal
        open={supplierModalOpen}
        purchaseItem={editingPurchaseItem}
        onCancel={() => {
          setSupplierModalOpen(false);
          setEditingPurchaseItem(null);
        }}
        onSave={handleSaveSupplier}
      />
    </div>
  );
}
