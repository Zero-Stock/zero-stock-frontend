'use client';

import { Button, Divider, Select, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { mockRawMaterials, type RawMaterial } from '../mockdata';

import MaterialEditModal from './MaterialEditModal';

const { Title, Text } = Typography;

const categories = ['冻品', '粮油', '肉类', '蔬菜'];

const parseUnit = (unit: RawMaterial['unit']) => {
  if (typeof unit === 'string') return null;

  const [unitName, weight] = Object.entries(unit)[0] ?? [];
  if (!unitName || !weight) return null;

  return { unitName, weight };
};

export default function MaterialList() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RawMaterial | null>(null);

  const filteredData = useMemo(() => {
    if (!selectedCategory) return mockRawMaterials;
    return mockRawMaterials.filter(
      (item) => item.category === selectedCategory,
    );
  }, [selectedCategory]);

  const handleEdit = (record: RawMaterial) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleSave = (values: RawMaterial) => {
    console.log('Saved values:', values);
    setIsEditModalOpen(false);
  };

  const columns: ColumnsType<RawMaterial> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => Number(a.id) - Number(b.id),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      render: (unit: RawMaterial['unit']) => {
        const parsedUnit = parseUnit(unit);

        if (!parsedUnit) {
          return <Text>{typeof unit === 'string' ? unit : '-'}</Text>;
        }

        return (
          <Text>
            {parsedUnit.unitName}
            <Divider orientation="vertical" />1{parsedUnit.unitName} ={' '}
            {parsedUnit.weight}
          </Text>
        );
      },
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
            className="!p-0"
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
        <Title level={2} className="!m-0">
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
          className="w-[200px]"
          onChange={(value) => setSelectedCategory(value)}
          options={categories.map((cat) => ({ label: cat, value: cat }))}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        // scroll={{ y: '43vh' }}
      />

      <MaterialEditModal
        visible={isEditModalOpen}
        record={editingRecord}
        onCancel={() => setIsEditModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
