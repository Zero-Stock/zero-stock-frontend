import { useEffect, useMemo, useState } from 'react';
import { Button, InputNumber, Table, Typography, message } from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { useProcurementList } from '../hooks/useProcurementList';
import { useReceivingTemplate } from '../hooks/useReceivingTemplate';
import { useReceivingCreate } from '../hooks/useReceivingCreate';
import type { ReceivingTemplateItemDto } from '../dtos/receivingTemplate.dto';

const { Title } = Typography;

export default function ReceivingList() {
  const [date] = useState(dayjs().format('YYYY-MM-DD'));
  const [procurementId, setProcurementId] = useState<number | undefined>(
    undefined,
  );
  const [editedRows, setEditedRows] = useState<
    Record<number, ReceivingTemplateItemDto>
  >({});

  const {
    procurements,
    isLoading: isLoadingList,
    mutate: mutateList,
  } = useProcurementList({
    date,
  });

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

  const tableData = useMemo(() => {
    const items = template?.items ?? [];
    return items.map((item) => editedRows[item.raw_material_id] ?? item);
  }, [template, editedRows]);

  const handleActualQuantityChange = (
    record: ReceivingTemplateItemDto,
    value: number | null,
  ) => {
    setEditedRows((prev) => ({
      ...prev,
      [record.raw_material_id]: {
        ...record,
        actual_quantity: value == null ? 0 : Number(value),
      },
    }));
  };

  const handleSubmit = async () => {
    if (!template?.procurement_id) {
      message.warning('No receiving template available');
      return;
    }

    try {
      await createReceivingTrigger({
        procurement_id: template.procurement_id,
        items: tableData.map((item) => ({
          raw_material_id: item.raw_material_id,
          actual_quantity: item.actual_quantity ?? 0,
        })),
      });

      message.success('Receiving submitted');
      setEditedRows({});
      await mutateList();
      await mutateTemplate();
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const columns: ColumnsType<ReceivingTemplateItemDto> = [
    {
      title: '品名',
      dataIndex: 'raw_material_name',
      key: 'raw_material_name',
      width: 220,
    },
    {
      title: '应收(kg)',
      dataIndex: 'expected_quantity',
      key: 'expected_quantity',
      width: 180,
    },
    {
      title: '实收(kg)',
      key: 'actual_quantity',
      width: 180,
      render: (_, record) => (
        <InputNumber
          value={record.actual_quantity ?? 0}
          min={0}
          onChange={(value) =>
            handleActualQuantityChange(
              record,
              value == null ? 0 : Number(value),
            )
          }
          className="w-full"
        />
      ),
    },
  ];

  const hasTemplate = Boolean(template?.procurement_id);
  const loading = isLoadingList || isLoadingTemplate;

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
        rowKey={(record) => String(record.raw_material_id)}
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
      />
    </div>
  );
}
