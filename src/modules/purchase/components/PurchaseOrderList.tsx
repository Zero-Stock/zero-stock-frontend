import { useState } from 'react';
import { App, Button, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'wouter';
import { useDateStore } from '@/shared/stores/dateStore';
import { useTranslation } from '@/shared/translation/LanguageContext';
import type { PurchaseOrderSchema } from '@/shared/types/schema';
import { usePurchaseList } from '../hooks/usePurchaseList';
import { usePurchaseGenerate } from '../hooks/usePurchaseGenerate';

export default function PurchaseOrderList() {
  const { t } = useTranslation();
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
      message.success(t('purchaseGenerateSuccess'));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : t('purchaseGenerateFailed'),
      );
    } finally {
      setGenerating(false);
    }
  };
  const columns: ColumnsType<PurchaseOrderSchema> = [
    {
      title: t('purchaseOrderId'),
      dataIndex: 'procurement_record_id',
      key: 'procurement_record_id',
    },
    { title: t('purchaseStatus'), dataIndex: 'status', key: 'status' },
    {
      title: t('purchaseNeededDate'),
      dataIndex: 'needed_date',
      key: 'needed_date',
    },
    {
      title: t('purchaseOrderDate'),
      dataIndex: 'order_date',
      key: 'order_date',
      render: (value: string | null) => value ?? '-',
    },
    {
      title: t('commonAction'),
      key: 'action',
      render: (_, record) => (
        <Link href={`/procurement/purchase/${record.procurement_record_id}`}>
          {t('purchaseDetail')}
        </Link>
      ),
    },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Typography.Title level={3}>{t('navPurchaseOrder')}</Typography.Title>
        <Button onClick={generate} loading={generating}>
          {t('purchaseGenerate')} · {date}
        </Button>
      </div>
      {error ? <div role="alert">{t('purchaseLoadFailed')}</div> : null}
      <Table
        rowKey="procurement_record_id"
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
