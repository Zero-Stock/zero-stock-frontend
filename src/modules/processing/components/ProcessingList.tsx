import { Button, Table, Typography, message } from 'antd';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ColumnsType } from 'antd/es/table';
import { useProcessingList } from '../hooks/useProcessingList';
import { useProcessingGenerate } from '../hooks/useProcessingGenerate';
import type { ProcessingItemDto } from '../dtos/processingItem.dto';
import { useMemo } from 'react';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title } = Typography;

export default function ProcessingList() {
  const { t } = useTranslation();
  const date = useDateStore((state) => state.date);

  const { items, isLoading, mutate } = useProcessingList();

  const { trigger: generateTrigger } = useProcessingGenerate();

  const handleGenerate = async () => {
    try {
      await generateTrigger({ date });
      message.success(t('processingGenerated'));
      await mutate();
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const columns: ColumnsType<ProcessingItemDto> = [
    {
      title: t('processingMaterialNameColumn'),
      dataIndex: 'material_name',
      key: 'material_name',
      width: 160,
    },
    {
      title: t('commonCategory'),
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: t('processingMethodColumn'),
      dataIndex: 'processing_method',
      key: 'processing_method',
      width: 160,
    },
    {
      title: t('processingRequirementColumn'),
      dataIndex: 'processing_requirement',
      key: 'processing_requirement',
      width: 120,
    },
    {
      title: t('processingTimeColumn'),
      dataIndex: 'processing_time',
      key: 'processing_time',
      width: 130,
    },
  ];

  const hasProcessing = useMemo(() => items.length > 0, [items]);

  return (
    <div>
      <div className="print-header mb-6 flex items-center justify-between">
        <Title level={2} className="mb-0!">
          {t('processingListTitle')}
        </Title>
        <div className="no-print flex items-center gap-3">
          <Button onClick={handleGenerate}>
            {hasProcessing ? t('commonRegenerate') : t('processingGenerate')}
          </Button>
        </div>
      </div>

      <Table
        rowKey={(_, index) => String(index)}
        columns={columns}
        dataSource={items}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        tableLayout="fixed"
        locale={{
          emptyText: hasProcessing
            ? t('processingNoItems')
            : t('processingNoData'),
        }}
        scroll={{ x: 620 }}
      />
    </div>
  );
}
