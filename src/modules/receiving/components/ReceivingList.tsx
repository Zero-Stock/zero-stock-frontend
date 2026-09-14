import { useMemo, useState } from 'react';
import { useDateStore } from '@/shared/stores/dateStore';
import { App, Button, InputNumber, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { formatKg } from '@/shared/utils/format';
import { usePurchaseList } from '@/modules/purchase/hooks/usePurchaseList';
import { usePurchaseSheet } from '@/modules/purchase/hooks/usePurchaseSheet';
import { useReceivingTemplate } from '../hooks/useReceivingTemplate';
import { useReceivingCreate } from '../hooks/useReceivingCreate';
import type {
  PurchaseOrderSchema,
  ReceivingTemplateItemSchema,
} from '@/shared/types/schema';

const { Title } = Typography;

type EditedReceivingRow = {
  actual_quantity: number;
  actual_unit_qty: number;
};

type ReceivingTableRow = PurchaseOrderSchema & {
  expected_quantity: number;
  expected_unit_qty: number;
  actual_quantity: number;
  actual_unit_qty: number;
};

export default function ReceivingList() {
  const { t } = useTranslation();
  const date = useDateStore((state) => state.date);
  const { message } = App.useApp();
  const [editedRows, setEditedRows] = useState<
    Record<string, EditedReceivingRow>
  >({});

  const {
    purchases: purchases,
    isLoading: isLoadingList,
    mutate: mutateList,
  } = usePurchaseList({ company_id: 1, needed_date: date });

  const currentPurchase = useMemo(() => {
    return purchases[0];
  }, [purchases]);

  const purchaseId = currentPurchase?.procurement_record_id;

  const {
    items: sheetItems,
    isLoading: isLoadingSheet,
    mutate: mutateSheet,
  } = usePurchaseSheet(purchaseId);

  const {
    template,
    isLoading: isLoadingTemplate,
    mutate: mutateTemplate,
  } = useReceivingTemplate(purchaseId);

  const { trigger: createReceivingTrigger } = useReceivingCreate();

  const tableData = useMemo<ReceivingTableRow[]>(() => {
    return sheetItems.map((sheetItem) => {
      const expectedQuantity = Number(sheetItem.required_g ?? 0);
      const expectedUnitQty = Number(sheetItem.required_special_unit ?? 0);

      const edited = editedRows[sheetItem.material_name];

      return {
        ...sheetItem,
        expected_quantity: expectedQuantity,
        expected_unit_qty: expectedUnitQty,
        actual_quantity: edited?.actual_quantity ?? expectedQuantity,
        actual_unit_qty: edited?.actual_unit_qty ?? expectedUnitQty,
      };
    });
  }, [sheetItems, editedRows]);

  const handleActualGChange = (
    record: ReceivingTableRow,
    value: number | null,
  ) => {
    const nextValue = value == null ? 0 : Number(value) * 1000;

    setEditedRows((prev) => {
      let nextUnitQty =
        prev[record.material_name]?.actual_unit_qty ?? record.expected_unit_qty;
      if (record.supplier_g_per_unit) {
        nextUnitQty = Number(
          (nextValue / record.supplier_g_per_unit).toFixed(2),
        );
      }
      return {
        ...prev,
        [record.material_name]: {
          actual_quantity: nextValue,
          actual_unit_qty: nextUnitQty,
        },
      };
    });
  };

  const handleActualUnitChange = (
    record: ReceivingTableRow,
    value: number | null,
  ) => {
    const nextValue = value == null ? 0 : Number(value);

    setEditedRows((prev) => {
      let nextGQty =
        prev[record.material_name]?.actual_quantity ?? record.expected_quantity;
      if (record.supplier_g_per_unit) {
        nextGQty = Number((nextValue * record.supplier_g_per_unit).toFixed(2));
      }
      return {
        ...prev,
        [record.material_name]: {
          actual_quantity: nextGQty,
          actual_unit_qty: nextValue,
        },
      };
    });
  };

  const handleSubmit = async () => {
    if (!template?.procurement_id) {
      message.warning(t('receivingNoData'));
      return;
    }

    try {
      await createReceivingTrigger({
        procurement_id: template.procurement_id,
        items: (template.items ?? []).map(
          (item: ReceivingTemplateItemSchema) => ({
            material_id: item.material_id,
            actual_quantity:
              editedRows[item.material_name]?.actual_quantity ??
              Number(
                sheetItems.find(
                  (sheetItem) => sheetItem.material_name === item.material_name,
                )?.required_g ?? 0,
              ),
          }),
        ),
      });

      message.success(t('receivingSubmitSuccess'));
      setEditedRows({});
      await mutateList();
      await mutateSheet();
      await mutateTemplate();
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const columns: ColumnsType<ReceivingTableRow> = [
    {
      title: t('purchaseColName'),
      dataIndex: 'material_name',
      key: 'material_name',
      width: 160,
    },
    {
      title: t('purchaseColCategory'),
      dataIndex: 'material_category',
      key: 'material_category',
      width: 140,
    },
    {
      title: t('purchaseColStockKg'),
      dataIndex: 'stock_g',
      key: 'stock_g',
      width: 120,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('purchaseColDemandKg'),
      dataIndex: 'demand_g',
      key: 'demand_g',
      width: 120,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('purchaseColDemandUnit'),
      dataIndex: 'demand_special_unit',
      key: 'demand_special_unit',
      width: 140,
    },
    {
      title: t('commonSupplier'),
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 180,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('purchaseColSupplierUnit'),
      dataIndex: 'supplier_unit',
      key: 'supplier_unit',
      width: 120,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('receivingColExpectedKg'),
      dataIndex: 'expected_quantity',
      key: 'expected_quantity',
      width: 140,
      render: (value: number) => formatKg(value),
    },
    {
      title: t('receivingColExpectedUnit'),
      dataIndex: 'expected_unit_qty',
      key: 'expected_unit_qty',
      width: 160,
    },
    {
      title: t('receivingColActualKg'),
      key: 'actual_quantity',
      width: 160,
      render: (_, record) => (
        <InputNumber
          value={Number((record.actual_quantity / 1000).toFixed(2))}
          min={0}
          step={0.01}
          precision={2}
          onChange={(value) => handleActualGChange(record, value)}
          className="w-full"
        />
      ),
    },
    {
      title: t('receivingColActualUnit'),
      key: 'actual_unit_qty',
      width: 170,
      render: (_, record) => (
        <InputNumber
          value={record.actual_unit_qty}
          min={0}
          onChange={(value) => handleActualUnitChange(record, value)}
          className="w-full"
        />
      ),
    },
  ];

  const hasTemplate = Boolean(template?.procurement_id);
  const loading = isLoadingList || isLoadingSheet || isLoadingTemplate;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('navReceivingOrder')}
        </Title>

        <Button type="primary" onClick={handleSubmit} disabled={!hasTemplate}>
          {t('purchaseSubmit')}
        </Button>
      </div>

      <Table
        rowKey={(record, index) => String(record.material_name ?? index)}
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={{ pageSize: 10 }}
        tableLayout="fixed"
        locale={{
          emptyText: hasTemplate ? t('receivingNoItems') : t('receivingNoData'),
        }}
        scroll={{ x: 2200 }}
      />
    </div>
  );
}
