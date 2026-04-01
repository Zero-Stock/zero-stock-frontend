import { Button, Select, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { type MaterialPreviewDto } from '../dtos/materialPreview.dto';
import { useMaterialList } from '../hooks/useMaterialList';
import { useTranslation } from '@/shared/translation/LanguageContext';

import MaterialEditModal from './MaterialEditModal';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useMaterialDelete } from '../hooks/useMaterialDelete';

const { Title, Text } = Typography;

export default function MaterialList() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaterialPreviewDto | null>(
    null,
  );

  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  const payload = useMemo(() => {
    return {
      category: selectedCategory ?? undefined,
    };
  }, [selectedCategory]);
  const { materials, isLoading, mutate } = useMaterialList(payload);

  const handleEdit = (record: MaterialPreviewDto) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };
  const { trigger: deleteMaterial } = useMaterialDelete();

  const handleDelete = async (id: number) => {
    await deleteMaterial(id);
    mutate();
  };

  const columns: ColumnsType<MaterialPreviewDto> = [
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
      dataIndex: 'current_yield_rate',
      key: 'current_yield_rate',
      width: 150,
      render: (yieldRate: number) => Number(yieldRate) * 100 + '%',
    },
    {
      title: t('commonSpecs'),
      dataIndex: 'specs',
      key: 'specs',
      render: (specs: MaterialPreviewDto['specs']) => (
        <Space orientation="vertical" size={0}>
          <Text>{specs?.map((spec) => spec.method_name).join(', ') ?? ''}</Text>
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
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
            className="p-0"
          >
            {t('delete')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('navMaterials')}
        </Title>
        <Button type="primary" onClick={() => navigate('/material/create')}>
          {t('materialCreate')}
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Select
          allowClear
          placeholder={t('materialFilterCategory')}
          className="w-60"
          onChange={(value) => setSelectedCategory(value)}
          options={categoryOptions}
          loading={isLoadingCategories}
        />
      </div>

      <Table
        columns={columns}
        dataSource={materials}
        rowKey="id"
        tableLayout="fixed"
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />

      <MaterialEditModal
        visible={isEditModalOpen}
        record={editingRecord}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdated={() => {
          mutate();
        }}
      />
    </div>
  );
}
