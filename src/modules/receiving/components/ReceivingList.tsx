import { useMemo, useState } from 'react';
import { useDateStore } from '@/shared/stores/dateStore';
import { App, Button, InputNumber, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatKg } from '@/shared/utils/format';
import { usePurchaseList } from '@/modules/purchase/hooks/usePurchaseList';
import { usePurchaseOrderItemList } from '@/modules/purchase/hooks/usePurchaseOrderItemList';
import { useReceivingTemplate } from '../hooks/useReceivingTemplate';
import { useReceivingCreate } from '../hooks/useReceivingCreate';
import type {
  PurchaseOrderItemSchema,
  ReceivingTemplateItemSchema,
} from '@/shared/types/schema';

const { Title } = Typography;

type EditedReceivingRow = {
  actual_quantity: number;
  actual_unit_qty: number;
};

type ReceivingTableRow = PurchaseOrderItemSchema & {
  expected_quantity: number;
  expected_unit_qty: number;
  actual_quantity: number;
  actual_unit_qty: number;
};

export default function ReceivingList() {
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

  const purchaseId = currentPurchase?.po_id;

  const {
    items: sheetItems,
    isLoading: isLoadingSheet,
    mutate: mutateSheet,
  } = usePurchaseOrderItemList(purchaseId);

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
      message.warning('暂无可收货的采购单，请先确认采购单');
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

      message.success('收货单已提交');
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
      title: '品名',
      dataIndex: 'material_name',
      key: 'material_name',
      width: 160,
    },
    {
      title: '规格/类别',
      dataIndex: 'material_category',
      key: 'material_category',
      width: 140,
    },
    {
      title: '库存(kg)',
      dataIndex: 'stock_g',
      key: 'stock_g',
      width: 120,
      render: (value: number) => formatKg(value),
    },
    {
      title: '需求(kg)',
      dataIndex: 'demand_g',
      key: 'demand_g',
      width: 120,
      render: (value: number) => formatKg(value),
    },
    {
      title: '需求(采购单位)',
      dataIndex: 'demand_special_unit',
      key: 'demand_special_unit',
      width: 140,
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 180,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: '供应商单位',
      dataIndex: 'supplier_unit',
      key: 'supplier_unit',
      width: 120,
      render: (value: string | null) => value ?? '-',
    },
    {
      title: '应收(kg)',
      dataIndex: 'expected_quantity',
      key: 'expected_quantity',
      width: 140,
      render: (value: number) => formatKg(value),
    },
    {
      title: '应收(采购单位)',
      dataIndex: 'expected_unit_qty',
      key: 'expected_unit_qty',
      width: 160,
    },
    {
      title: '实收(kg)',
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
      title: '实收(采购单位)',
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
          {'收货单'}
        </Title>

        <Button type="primary" onClick={handleSubmit} disabled={!hasTemplate}>
          {'确认采购单'}
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
          emptyText: hasTemplate
            ? '暂无收货单明细'
            : '暂无可收货的采购单，请先确认采购单',
        }}
        scroll={{ x: 2200 }}
      />
    </div>
  );
}
