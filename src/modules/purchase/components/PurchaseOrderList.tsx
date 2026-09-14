import { useState } from 'react';
import { App, Button, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'wouter';
import { useDateStore } from '@/shared/stores/dateStore';
import type { PurchasePreviewSchema } from '@/shared/types/schema';
import { usePurchaseList } from '../hooks/usePurchaseList';
import { usePurchaseGenerate } from '../hooks/usePurchaseGenerate';

export default function PurchaseOrderList() {
  const { message } = App.useApp();
  const date = useDateStore((state) => state.date);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [generating, setGenerating] = useState(false);
  const { purchases, total, isLoading, error, mutate } = usePurchaseList({
    company_id: 1,
    page,
    page_size: pageSize,
  });

  const { trigger } = usePurchaseGenerate();
  const generate = async () => {
    try {
      setGenerating(true);
      await trigger({ needed_date: date });
      setPage(1);
      await mutate();
      message.success('采购单已生成');
    } catch (error) {
      message.error(error instanceof Error ? error.message : '采购单生成失败');
    } finally {
      setGenerating(false);
    }
  };

  const columns: ColumnsType<PurchasePreviewSchema> = [
    {
      title: '采购单 ID',
      dataIndex: 'po_id',
      key: 'po_id',
    },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '需求日期',
      dataIndex: 'needed_date',
      key: 'needed_date',
    },
    {
      title: '下单日期',
      dataIndex: 'order_date',
      key: 'order_date',
      render: (value: string | null) => value ?? '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Link href={`/procurement/purchase/${record.po_id}`}>{'详情'}</Link>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Typography.Title level={3}>{'采购单'}</Typography.Title>
        <Button onClick={generate} loading={generating}>
          {'生成采购单'} · {date}
        </Button>
      </div>
      {error ? <div role="alert">{'采购单不存在或加载失败'}</div> : null}
      <Table
        rowKey="po_id"
        columns={columns}
        dataSource={purchases}
        loading={isLoading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true }}
        onChange={(pagination) => {
          setPage(pagination.current ?? 1);
          setPageSize(pagination.pageSize ?? 10);
        }}
      />
    </div>
  );
}
