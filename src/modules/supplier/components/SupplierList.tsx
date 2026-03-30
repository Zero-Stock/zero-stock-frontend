import { useState } from 'react';
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { useLocation } from 'wouter';

import SupplierEditModal from './SupplierEditModal';
import { useSupplierList } from '../hooks/useSupplierList';
import { useSupplierUpdate } from '../hooks/useSupplierUpdate';
import { useSupplierDelete } from '../hooks/useSupplierDelete';
import type { SupplierPreviewDto } from '../dtos/supplierPreview.dto';
import type { SupplierUpdateDto } from '../dtos/supplierUpdate.dto';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Title } = Typography;

export default function SupplierList() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const [keyword, setKeyword] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<SupplierUpdateDto | null>(null);

  const { suppliers, isLoading, mutate } = useSupplierList({
    search: keyword.trim() || undefined,
  });

  const { trigger: updateTrigger } = useSupplierUpdate();
  const { trigger: deleteTrigger } = useSupplierDelete();

  const columns = [
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
      render: (_: any, record: SupplierPreviewDto) => (
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
      <div className="mb-6 flex items-center justify-between">
        <Title level={2} className="mb-0!">
          {t('supplierListTitle')}
        </Title>
        <Button type="primary" onClick={() => navigate('/supplier/create')}>
          {t('navCreateSupplier')}
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Input
          placeholder={t('supplierSearchName')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-105"
          allowClear
        />
      </div>

      <Table
        rowKey="id"
        columns={columns as any}
        dataSource={suppliers}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
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
