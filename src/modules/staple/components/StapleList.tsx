import { useEffect, useState } from 'react';
import { App, Button, Popconfirm, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type {
  StaplePreviewSchema,
  StapleUpsertSchema,
} from '@/shared/types/schema';
import { useStapleCreate } from '../hooks/useStapleCreate';
import { useStapleDelete } from '../hooks/useStapleDelete';
import { useStapleList } from '../hooks/useStapleList';
import { useStapleUpdate } from '../hooks/useStapleUpdate';
import StapleEditModal from './StapleEditModal';

const { Title } = Typography;

export default function StapleList() {
  const { message } = App.useApp();
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
      message.error('加载主食失败');
    }
  }, [isError, message]);

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
        message.success('主食已更新');
      } else {
        await createStaple(payload);
        message.success('主食已创建');
      }

      setIsModalVisible(false);
      await mutate();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || '保存主食失败');
        return;
      }

      message.error('保存主食失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStaple(id);
      message.success('主食已删除');
      await mutate();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || '删除主食失败');
        return;
      }

      message.error('删除主食失败');
    }
  };

  const columns: ColumnsType<StaplePreviewSchema> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '单位',
      dataIndex: 'unit_name',
      key: 'unit_name',
      width: 180,
    },
    {
      title: '每单位克重',
      dataIndex: 'g_per_unit',
      key: 'g_per_unit',
      width: 180,
    },
    {
      title: '操作',
      key: 'operation',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            className="p-0!"
          >
            {'编辑'}
          </Button>
          <Popconfirm
            title={'确定要删除这个主食吗？'}
            onConfirm={() => handleDelete(record.id)}
            okText={'是'}
            cancelText={'否'}
          >
            <Button type="link" danger className="p-0!">
              {'删除'}
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
          {'主食'}
        </Title>
        <Button type="primary" onClick={handleCreate}>
          {'新建主食'}
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
