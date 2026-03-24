import { useEffect, useMemo, useState } from 'react';
import { Button, InputNumber, Table, Typography, message } from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

import { useProcurementList } from '../hooks/useProcurementList';
import { useProcurementSheet } from '../hooks/useProcurementSheet';
import { useReceivingTemplate } from '../hooks/useReceivingTemplate';
import { useReceivingCreate } from '../hooks/useReceivingCreate';
import type { ProcurementSheetItemDto } from '../dtos/procurementSheetItem.dto';
import type { ReceivingTemplateItemDto } from '../dtos/receivingTemplate.dto';

const { Title } = Typography;

type ReceivingTableRow = ProcurementSheetItemDto & {
  actual_quantity: number;
  actual_unit_qty: number;
};

export default function ReceivingList() {
  const [date] = useState(dayjs().format('YYYY-MM-DD'));
  // const [date] = useState('2026-03-23');
  const [procurementId, setProcurementId] = useState<number | undefined>(
    undefined,
  );
  const [editedRows, setEditedRows] = useState<Record<string, number>>({});

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
    template,
    isLoading: isLoadingTemplate,
    mutate: mutateTemplate,
  } = useReceivingTemplate(procurementId);

  const { trigger: createReceivingTrigger } = useReceivingCreate();

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

  const tableData = useMemo<ReceivingTableRow[]>(() => {
    return sheetItems.map((sheetItem) => {
      const purchaseKg = Number(sheetItem.purchase_kg ?? 0);
      const kgPerUnit = Number(sheetItem.supplier_kg_per_unit ?? 0);
      const purchaseUnitQty = Number(sheetItem.purchase_unit_qty ?? 0);

      const actualQuantity = editedRows[sheetItem.name] ?? purchaseKg;
      const actualUnitQty =
        kgPerUnit > 0
          ? Number((actualQuantity / kgPerUnit).toFixed(2))
          : purchaseUnitQty;

      return {
        ...sheetItem,
        actual_quantity: actualQuantity,
        actual_unit_qty: actualUnitQty,
      };
    });
  }, [sheetItems, editedRows]);

  const handleSubmit = async () => {
    if (!template?.procurement_id) {
      message.warning('No receiving template available');
      return;
    }

    try {
      await createReceivingTrigger({
        procurement_id: template.procurement_id,
        items: (template.items ?? []).map((item: ReceivingTemplateItemDto) => ({
          raw_material_id: item.raw_material_id,
          actual_quantity:
            editedRows[item.raw_material_name] ??
            Number(
              sheetItems.find(
                (sheetItem) => sheetItem.name === item.raw_material_name,
              )?.purchase_kg ?? 0,
            ),
        })),
      });

      message.success('Receiving submitted');
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
      title: '应收(kg)',
      dataIndex: 'purchase_kg',
      key: 'purchase_kg',
      width: 140,
    },
    {
      title: '应收(特殊单位)',
      dataIndex: 'purchase_unit_qty',
      key: 'purchase_unit_qty',
      width: 160,
    },
    {
      title: '实收(kg)',
      key: 'actual_quantity',
      width: 160,
      render: (_, record) => (
        <InputNumber
          value={record.actual_quantity ?? 0}
          min={0}
          onChange={(value) => {
            setEditedRows((prev) => ({
              ...prev,
              [record.name]: value == null ? 0 : Number(value),
            }));
          }}
          className="w-full"
        />
      ),
    },
    {
      title: '实收(特殊单位)',
      key: 'actual_unit_qty',
      width: 170,
      render: (_, record) => record.actual_unit_qty ?? '-',
    },
  ];

  const hasTemplate = Boolean(template?.procurement_id);
  const loading = isLoadingList || isLoadingSheet || isLoadingTemplate;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Title level={2} className="mb-0!">
          Receiving Order
        </Title>

        <Button type="primary" onClick={handleSubmit} disabled={!hasTemplate}>
          Submit
        </Button>
      </div>

      <Table
        rowKey={(record, index) => String(record.name ?? index)}
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={{ pageSize: 10 }}
        tableLayout="fixed"
        locale={{
          emptyText: hasTemplate
            ? '暂无收货单明细'
            : '暂无可收货的采购单，请先提交 Procurement',
        }}
        scroll={{ x: 2100 }}
      />
    </div>
  );
}
