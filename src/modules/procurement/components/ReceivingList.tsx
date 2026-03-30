import { useEffect, useMemo, useState } from 'react';
import { Button, InputNumber, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useProcurementList } from '../hooks/useProcurementList';
import { useProcurementSheet } from '../hooks/useProcurementSheet';
import { useReceivingTemplate } from '../hooks/useReceivingTemplate';
import { useReceivingCreate } from '../hooks/useReceivingCreate';
import type { ProcurementSheetItemDto } from '../dtos/procurementSheetItem.dto';
import type { ReceivingTemplateItemDto } from '../dtos/receivingTemplate.dto';

const { Title } = Typography;

type EditedReceivingRow = {
  actual_quantity: number;
  actual_unit_qty: number;
};

type ReceivingTableRow = ProcurementSheetItemDto & {
  expected_quantity: number;
  expected_unit_qty: number;
  actual_quantity: number;
  actual_unit_qty: number;
};

export default function ReceivingList() {
  const { t } = useTranslation();
  const [procurementId, setProcurementId] = useState<number | undefined>(
    undefined,
  );
  const [editedRows, setEditedRows] = useState<
    Record<string, EditedReceivingRow>
  >({});

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
      const expectedQuantity = Number(sheetItem.purchase_kg ?? 0);
      const expectedUnitQty = Number(sheetItem.purchase_unit_qty ?? 0);

      const edited = editedRows[sheetItem.name];

      return {
        ...sheetItem,
        expected_quantity: expectedQuantity,
        expected_unit_qty: expectedUnitQty,
        actual_quantity: edited?.actual_quantity ?? expectedQuantity,
        actual_unit_qty: edited?.actual_unit_qty ?? expectedUnitQty,
      };
    });
  }, [sheetItems, editedRows]);

  const handleActualKgChange = (
    record: ReceivingTableRow,
    value: number | null,
  ) => {
    const nextValue = value == null ? 0 : Number(value);

    setEditedRows((prev) => ({
      ...prev,
      [record.name]: {
        actual_quantity: nextValue,
        actual_unit_qty:
          prev[record.name]?.actual_unit_qty ?? record.expected_unit_qty,
      },
    }));
  };

  const handleActualUnitChange = (
    record: ReceivingTableRow,
    value: number | null,
  ) => {
    const nextValue = value == null ? 0 : Number(value);

    setEditedRows((prev) => ({
      ...prev,
      [record.name]: {
        actual_quantity:
          prev[record.name]?.actual_quantity ?? record.expected_quantity,
        actual_unit_qty: nextValue,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!template?.procurement_id) {
      message.warning(t('receivingNoData'));
      return;
    }

    try {
      await createReceivingTrigger({
        procurement_id: template.procurement_id,
        items: (template.items ?? []).map((item: ReceivingTemplateItemDto) => ({
          raw_material_id: item.raw_material_id,
          actual_quantity:
            editedRows[item.raw_material_name]?.actual_quantity ??
            Number(
              sheetItems.find(
                (sheetItem) => sheetItem.name === item.raw_material_name,
              )?.purchase_kg ?? 0,
            ),
        })),
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
      title: t('procurementColName'),
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: t('procurementColCategory'),
      dataIndex: 'category',
      key: 'category',
      width: 140,
    },
    {
      title: t('procurementColDemandKg'),
      dataIndex: 'demand_kg',
      key: 'demand_kg',
      width: 120,
    },
    {
      title: t('procurementColDemandUnit'),
      dataIndex: 'demand_unit_qty',
      key: 'demand_unit_qty',
      width: 140,
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
      title: t('receivingColExpectedKg'),
      dataIndex: 'expected_quantity',
      key: 'expected_quantity',
      width: 140,
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
          value={record.actual_quantity}
          min={0}
          onChange={(value) => handleActualKgChange(record, value)}
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
          {t('procurementSubmit')}
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
          emptyText: hasTemplate ? t('receivingNoItems') : t('receivingNoData'),
        }}
        scroll={{ x: 2200 }}
      />
    </div>
  );
}
