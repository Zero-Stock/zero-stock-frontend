import { useMemo, useState } from 'react';
import {
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { useLocation } from 'wouter';

import SupplierEditModal from './SupplierEditModal';
import useMaterialOptions from '@/modules/material/hooks/useMaterialOptions';
import { useSupplierList } from '../hooks/useSupplierList';
import { useSupplierUpdate } from '../hooks/useSupplierUpdate';
import { useSupplierDelete } from '../hooks/useSupplierDelete';
import type {
  SupplierPreviewSchema,
  SupplierUpsertSchema,
} from '@/shared/types/schema';
import { useTranslation } from '@/shared/translation/LanguageContext';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

export default function SupplierList() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const [keyword, setKeyword] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<
    (SupplierUpsertSchema & Required<Pick<SupplierUpsertSchema, 'id'>>) | null
  >(null);

  const { materialOptions, isLoading: isLoadingMaterials } =
    useMaterialOptions();

  const payload = useMemo(() => {
    return {
      name: keyword.trim() || undefined,
      material_id: selectedMaterialId,
      page,
      page_size: pageSize,
    };
  }, [keyword, page, pageSize, selectedMaterialId]);

  const { suppliers, total, isLoading, mutate } = useSupplierList(payload);

  const { trigger: updateTrigger } = useSupplierUpdate();
  const { trigger: deleteTrigger } = useSupplierDelete();

  const columns: ColumnsType<SupplierPreviewSchema> = [
    { title: t('commonName'), dataIndex: 'name', key: 'name' },
    {
      title: t('commonContactPerson'),
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    { title: t('commonPhone'), dataIndex: 'phone', key: 'phone' },
    { title: t('commonAddress'), dataIndex: 'address', key: 'address' },
    {
      title: t('commonOperation'),
      key: 'operation',
      width: 220,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/supplier/${record.id}`)}
            className="p-0!"
          >
            {t('supplierDetail')}
          </Button>

          <Button
            type="link"
            onClick={() => {
              setEditing({
                id: record.id,
                name: record.name,
                contact_person: record.contact_person,
                phone: record.phone,
                address: record.address,
              });
              setEditOpen(true);
            }}
            className="p-0!"
          >
            {t('edit')}
          </Button>

          <Popconfirm
            title={t('supplierDeleteConfirm')}
            okText={t('delete')}
            okButtonProps={{ danger: true }}
            cancelText={t('cancel')}
            onConfirm={async () => {
              await deleteTrigger(record.id);
              message.success(t('supplierDeleted'));
              mutate();
            }}
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
      <div className="mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('supplierListTitle')}
        </Title>
        <Button type="primary" onClick={() => navigate('/supplier/create')}>
          {t('navCreateSupplier')}
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Input.Search
          placeholder={t('supplierSearchName')}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          className="w-60!"
          allowClear
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

      <Table
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
        loading={isLoading}
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
        tableLayout="fixed"
      />

      <SupplierEditModal
        open={editOpen}
        supplier={editing}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onSave={async (next) => {
          await updateTrigger(next);
          message.success(t('supplierUpdated'));
          mutate();
          setEditOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
