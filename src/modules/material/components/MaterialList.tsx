import {
  App,
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useMaterialList } from '../hooks/useMaterialList';
import { useTranslation } from '@/shared/translation/LanguageContext';
import type { MaterialPreviewSchema } from '@/shared/types/schema';

import MaterialEditModal from './MaterialEditModal';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useMaterialDelete } from '../hooks/useMaterialDelete';

const { Title } = Typography;

export default function MaterialList() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<MaterialPreviewSchema | null>(null);

  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  const payload = useMemo(() => {
    return {
      category_id: selectedCategory ?? undefined,
      name: keyword.trim() || undefined,
      page,
      page_size: pageSize,
    };
  }, [keyword, page, pageSize, selectedCategory]);
  const { materials, total, isLoading, mutate } = useMaterialList(payload);

  const handleEdit = (record: MaterialPreviewSchema) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };
  const { trigger: deleteMaterial } = useMaterialDelete();

  const handleDelete = async (id: number) => {
    try {
      await deleteMaterial(id);
      message.success(t('materialDeleted'));
      mutate();
    } catch (error) {
      if (!(error instanceof Error)) return;
      message.error(error.message);
    }
  };

  const columns: ColumnsType<MaterialPreviewSchema> = [
    {
      title: t('commonName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('commonCategory'),
      dataIndex: 'category_name',
      key: 'category_name',
      width: 150,
    },
    {
      title: t('commonYieldRate'),
      dataIndex: 'yield_rate',
      key: 'yield_rate',
      width: 120,
      render: (yieldRate: string) => Number(yieldRate) * 100 + '%',
    },
    {
      title: '默认供应商',
      dataIndex: 'default_supplier_name',
      key: 'default_supplier_name',
      width: 250,
      render: (name: string | null) => name || '-',
    },
    {
      title: t('commonSpecs'),
      dataIndex: 'processing',
      key: 'processing',
      render: (processing: MaterialPreviewSchema['processing']) => (
        <Space size="small" wrap>
          {processing?.map((method) => (
            <Tag key={method.id}>{method.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('commonOperation'),
      key: 'operation',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link onClick={() => handleEdit(record)}>
            {t('edit')}
          </Typography.Link>
          <Popconfirm
            title={t('materialDeleteConfirm')}
            okText={t('delete')}
            okButtonProps={{ danger: true }}
            cancelText={t('cancel')}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger className="p-0">
              {t('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('navRawMaterials')}
        </Title>
        <Button type="primary" onClick={() => navigate('/material/create')}>
          {t('materialCreate')}
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Input.Search
          allowClear
          placeholder={t('materialSearchName')}
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
            setPage(1);
          }}
          className="w-60!"
        />
        <Select
          allowClear
          placeholder={t('materialFilterCategory')}
          className="w-60"
          onChange={(value) => {
            setSelectedCategory(value);
            setPage(1);
          }}
          options={categoryOptions}
          loading={isLoadingCategories}
        />
      </div>

      <Table
        columns={columns}
        dataSource={materials}
        rowKey="id"
        tableLayout="fixed"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={(pagination) => {
          setPage(pagination.current ?? 1);
          setPageSize(pagination.pageSize ?? 10);
        }}
        loading={isLoading}
      />

      <MaterialEditModal
        visible={isEditModalOpen}
        record={editingRecord}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdated={() => mutate()}
      />
    </div>
  );
}
