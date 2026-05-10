import { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type {
  StaplePreviewSchema,
  StapleUpsertSchema,
} from '@/shared/types/schema';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useStapleCreate } from '../hooks/useStapleCreate';
import { useStapleDelete } from '../hooks/useStapleDelete';
import { useStapleList } from '../hooks/useStapleList';
import { useStapleUpdate } from '../hooks/useStapleUpdate';
import StapleEditModal from './StapleEditModal';

const { Title } = Typography;

export default function StapleList() {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingStaple, setEditingStaple] =
    useState<StaplePreviewSchema | null>(null);

  const { staples, isLoading, isError, mutate } = useStapleList();
  const { trigger: createStaple } = useStapleCreate();
  const { trigger: updateStaple } = useStapleUpdate();
  const { trigger: deleteStaple } = useStapleDelete();

  useEffect(() => {
    if (isError) {
      message.error(t('stapleLoadFailed'));
    }
  }, [isError, t]);

  const handleCreate = () => {
    setEditingStaple(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: StaplePreviewSchema) => {
    setEditingStaple(record);
    setIsModalVisible(true);
  };

  const handleSave = async (payload: StapleUpsertSchema) => {
    try {
      setIsSaving(true);

      if (editingStaple) {
        await updateStaple(editingStaple.id, payload);
        message.success(t('stapleUpdated'));
      } else {
        await createStaple(payload);
        message.success(t('stapleCreated'));
      }

      setIsModalVisible(false);
      await mutate();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || t('stapleSaveFailed'));
        return;
      }

      message.error(t('stapleSaveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStaple(id);
      message.success(t('stapleDeleted'));
      await mutate();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || t('stapleDeleteFailed'));
        return;
      }

      message.error(t('stapleDeleteFailed'));
    }
  };

  const columns: ColumnsType<StaplePreviewSchema> = [
    {
      title: t('commonName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('commonUnit'),
      dataIndex: 'unit_name',
      key: 'unit_name',
      width: 180,
    },
    {
      title: t('stapleGramsPerUnit'),
      dataIndex: 'g_per_unit',
      key: 'g_per_unit',
      width: 180,
    },
    {
      title: t('commonOperation'),
      key: 'operation',
      width: 200,
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
            title={t('stapleDeleteConfirm')}
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
      <div className="mb-4 flex items-center justify-between">
        <Title level={3} className="mb-0!">
          {t('navStaples')}
        </Title>
        <Button type="primary" onClick={handleCreate}>
          {t('stapleCreate')}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={staples}
        rowKey="id"
        tableLayout="fixed"
        pagination={false}
        loading={isLoading}
      />

      <StapleEditModal
        visible={isModalVisible}
        record={editingStaple}
        confirmLoading={isSaving}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
      />
    </div>
  );
}
