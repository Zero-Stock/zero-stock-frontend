import {
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import type {
  DishIngredientSchema,
  DishPreviewSchema,
  DishUpsertSchema,
} from '@/shared/types/schema';
import { useDishCreate } from '../hooks/useDishCreate';
import { useDishDelete } from '../hooks/useDishDelete';
import { useDishList } from '../hooks/useDishList';
import { useDishUpdate } from '../hooks/useDishUpdate';
import DishEditModal from './DishEditModal';
import { useTranslation } from '@/shared/translation/LanguageContext';
import useMaterialOptions from '@/modules/material/hooks/useMaterialOptions';

const { Title } = Typography;

function formatIngredientWeight(ingredient: DishIngredientSchema): string {
  const grams = Math.round(parseFloat(ingredient.net_quantity));

  return Number.isNaN(grams) ? ingredient.net_quantity : `${grams}g`;
}

function formatIngredient(ingredient: DishIngredientSchema): string {
  const processingMethod = (ingredient.processing_method ?? '').trim();
  const processingText = processingMethod ? ` (${processingMethod})` : '';

  return `${ingredient.material_name}${processingText} - ${formatIngredientWeight(ingredient)}`;
}

export default function DishList() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDish, setEditingDish] = useState<DishPreviewSchema | null>(
    null,
  );
  const { materialOptions, isLoading: isLoadingMaterials } =
    useMaterialOptions();

  const payload = useMemo(() => {
    return {
      name: searchText.trim() || undefined,
      material_id: selectedMaterialId,
      page,
      page_size: pageSize,
    };
  }, [page, pageSize, searchText, selectedMaterialId]);

  const {
    dishes,
    total,
    isLoading: loading,
    isError,
    mutate,
  } = useDishList(payload);

  const { trigger: createDish } = useDishCreate();
  const { trigger: updateDish } = useDishUpdate();
  const { trigger: deleteDish } = useDishDelete();

  useEffect(() => {
    const enablePrintMode = () => {
      document.body.classList.add('dish-print-mode');
    };

    const disablePrintMode = () => {
      document.body.classList.remove('dish-print-mode');
    };

    window.addEventListener('beforeprint', enablePrintMode);
    window.addEventListener('afterprint', disablePrintMode);

    return () => {
      window.removeEventListener('beforeprint', enablePrintMode);
      window.removeEventListener('afterprint', disablePrintMode);
      disablePrintMode();
    };
  }, []);

  useEffect(() => {
    if (isError) {
      console.error('Failed to fetch dishes:', isError);
      message.error(t('dishLoadFailed'));
    }
  }, [isError, t]);

  const handlePrint = () => {
    window.requestAnimationFrame(() => {
      window.print();
    });
  };

  const handleEdit = (record: DishPreviewSchema) => {
    setEditingDish(record);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setEditingDish(null);
    setIsModalVisible(true);
  };

  // ─── Save via API ───
  const handleSave = async (payload: DishUpsertSchema) => {
    try {
      if (editingDish) {
        await updateDish(editingDish.id, payload);
        message.success(t('dishUpdated'));
      } else {
        await createDish(payload);
        message.success(t('dishCreated'));
      }
      setIsModalVisible(false);
      await mutate();
    } catch (err) {
      console.error('Failed to save dish:', err);
      message.error(t('dishSaveFailed'));
    }
  };

  // ─── Delete via API ───
  const handleDelete = async (id: number) => {
    try {
      await deleteDish(id);
    } catch (err) {
      // Some backends may delete successfully but still return a bad/empty response.
      // We'll verify by reloading dishes before deciding the final UI message.
      console.warn(
        'Delete dish request errored, verifying with fresh data...',
        err,
      );
    }

    try {
      const latestResponse = await mutate();
      const latest = latestResponse?.result.list ?? dishes;
      const deleted = !latest.some((d) => d.id === id);

      if (deleted) {
        message.success(t('dishDeleted'));
        return;
      }
    } catch (syncErr) {
      console.error('Failed to refresh dishes after delete:', syncErr);
    }

    message.error(t('dishDeleteFailed'));
  };

  const columns: ColumnsType<DishPreviewSchema> = [
    {
      title: t('dishColName'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name, 'zh-CN'),
      width: '12%',
    },
    {
      title: t('dishColIngredients'),
      dataIndex: 'ingredients',
      key: 'ingredients',
      width: '19%',
      render: (ingredients: DishIngredientSchema[]) => (
        <Space size="small" wrap>
          {ingredients.map((ingredient, index) => (
            <Tag
              key={`${ingredient.material_id}-${ingredient.processing_method ?? ''}-${index}`}
              className="m-0! max-w-full"
            >
              {formatIngredient(ingredient)}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('dishColSeasonings'),
      dataIndex: 'seasonings',
      key: 'seasonings',
      width: '15%',
      render: (seasonings: string) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>{seasonings}</div>
      ),
    },
    {
      title: t('dishColCookingMethod'),
      dataIndex: 'cooking_method',
      key: 'cooking_method',
      width: '19%',
      render: (method: string) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>{method}</div>
      ),
    },
    {
      title: t('commonAction'),
      key: 'action',
      className: 'no-print',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            className="p-0!"
          >
            {t('edit')}
          </Button>
          <Popconfirm
            title={t('dishDeleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button type="link" danger className="p-0!">
              {t('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('dishListTitle')}
        </Title>
        <Space>
          <Button type="primary" onClick={handleCreate}>
            {t('dishCreate')}
          </Button>
          <Button onClick={handlePrint}>{t('commonExportPdf')}</Button>
        </Space>
      </div>

      <div className="no-print mb-4 flex items-center gap-4">
        <Input.Search
          placeholder={t('dishSearchName')}
          allowClear
          value={searchText}
          onSearch={(value) => {
            setSearchText(value);
            setPage(1);
          }}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          className="w-60!"
        />
        <Select
          allowClear
          showSearch={{ optionFilterProp: 'label' }}
          placeholder={t('commonSelectMaterial')}
          value={selectedMaterialId}
          onChange={(value) => {
            setSelectedMaterialId(value);
            setPage(1);
          }}
          options={materialOptions}
          loading={isLoadingMaterials}
          className="w-60"
        />
      </div>

      {/* Print Header */}
      <Title level={3} className="print-only m-0! mb-5 hidden text-center">
        {t('dishListTitle')}
      </Title>

      <Table
        columns={columns}
        dataSource={dishes}
        rowKey="id"
        tableLayout="fixed"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          className: 'no-print-pagination',
        }}
        onChange={(pagination) => {
          setPage(pagination.current ?? 1);
          setPageSize(pagination.pageSize ?? 10);
        }}
        loading={loading}
      />

      <DishEditModal
        visible={isModalVisible}
        record={editingDish}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
      />

      {/* Print Styles */}
      <style>{`
        @media print {
          body.dish-print-mode {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body.dish-print-mode .no-print {
            display: none !important;
          }

          body.dish-print-mode .print-only {
            display: block !important;
          }

          body.dish-print-mode .no-print-pagination,
          body.dish-print-mode .ant-pagination,
          body.dish-print-mode .ant-table-column-sorters,
          body.dish-print-mode .ant-table-filter-trigger,
          body.dish-print-mode .ant-table-row-expand-icon-cell,
          body.dish-print-mode .ant-spin-nested-loading > div > .ant-spin {
            display: none !important;
          }

          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          body.dish-print-mode {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            color: #111 !important;
            font-family: "Times New Roman", "Noto Serif SC", serif !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
          }

          body.dish-print-mode * {
            color: inherit !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }

          body.dish-print-mode .ant-layout,
          body.dish-print-mode .ant-layout-content,
          body.dish-print-mode .ant-app {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body.dish-print-mode .ant-layout-sider,
          body.dish-print-mode .ant-layout-header,
          body.dish-print-mode .ant-layout-footer,
          body.dish-print-mode nav {
            display: none !important;
          }

          body.dish-print-mode .ant-typography.print-only {
            margin: 0 0 10mm !important;
            text-align: center !important;
            font-size: 20px !important;
            font-weight: 700 !important;
            letter-spacing: 0.04em !important;
          }

          body.dish-print-mode .ant-table-wrapper,
          body.dish-print-mode .ant-table,
          body.dish-print-mode .ant-table-container,
          body.dish-print-mode .ant-table-content {
            background: transparent !important;
            overflow: visible !important;
          }

          body.dish-print-mode .ant-table {
            border: 1px solid #222 !important;
            border-radius: 0 !important;
          }

          body.dish-print-mode .ant-table table {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
          }

          body.dish-print-mode .ant-table-thead {
            display: table-header-group !important;
          }

          body.dish-print-mode .ant-table-thead > tr > th {
            padding: 8px 10px !important;
            background: #f3f3f3 !important;
            border-right: 1px solid #222 !important;
            border-bottom: 2px solid #222 !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            text-align: left !important;
            vertical-align: top !important;
          }

          body.dish-print-mode .ant-table-thead > tr > th:last-child,
          body.dish-print-mode .ant-table-tbody > tr > td:last-child {
            border-right: none !important;
          }

          body.dish-print-mode .ant-table-tbody > tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          body.dish-print-mode .ant-table-tbody > tr > td {
            padding: 8px 10px !important;
            background: transparent !important;
            border-right: 1px solid #222 !important;
            border-bottom: 1px solid #bdbdbd !important;
            vertical-align: top !important;
            white-space: pre-wrap !important;
            word-break: break-word !important;
          }

          body.dish-print-mode .ant-table-tbody > tr:last-child > td {
            border-bottom: none !important;
          }

          body.dish-print-mode .ant-table-cell::before,
          body.dish-print-mode .ant-table-cell-scrollbar,
          body.dish-print-mode .ant-table-measure-row,
          body.dish-print-mode .ant-empty,
          body.dish-print-mode .ant-spin-blur {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
