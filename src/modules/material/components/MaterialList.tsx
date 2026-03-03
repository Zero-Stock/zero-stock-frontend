import { Button, Select, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { type MaterialPreviewDto } from '../dtos/materialPreview.dto';
import { useMaterialList } from '../hooks/useMaterialList';

import MaterialEditModal from './MaterialEditModal';
import useMaterialCategories from '../hooks/useMaterialCategories';

const { Title, Text } = Typography;

export default function MaterialList() {
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

  const columns: ColumnsType<MaterialPreviewDto> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: 'Yield Rate',
      dataIndex: 'current_yield_rate',
      key: 'current_yield_rate',
    },
    {
      title: 'Specs',
      dataIndex: 'specs',
      key: 'specs',
      render: (specs: MaterialPreviewDto['specs']) => (
        <Space orientation="vertical" size={0}>
          <Text>{specs.map((spec) => spec.method_name).join(', ')}</Text>
        </Space>
      ),
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link onClick={() => handleEdit(record)}>
            Edit
          </Typography.Link>
          <Button
            type="link"
            danger
            onClick={() => console.log('Delete:', record)}
            className="p-0"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Title level={2} className="m-0">
          Raw Materials
        </Title>
        <Button type="primary" onClick={() => navigate('/material/create')}>
          New Raw Material
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Text strong>Filter by Category:</Text>
        <Select
          allowClear
          placeholder="All Categories"
          className="w-50"
          onChange={(value) => setSelectedCategory(value)}
          options={categoryOptions}
          loading={isLoadingCategories}
        />
      </div>

      <Table
        columns={columns}
        dataSource={materials}
        rowKey="id"
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
