import { App, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useMemo, useState } from 'react';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useMaterialUpdate } from '../hooks/useMaterialUpdate';
import {
  decimalYieldRateToPercent,
  isValidYieldRatePercent,
  percentYieldRateToDecimal,
} from '../utils/yieldRate';
import type {
  MaterialPreviewSchema,
  MaterialUpsertSchema,
} from '@/shared/types/schema';

interface MaterialEditModalProps {
  visible: boolean;
  record: MaterialPreviewSchema | null;
  onCancel: () => void;
  onUpdated?: () => void;
}

type MaterialEditFormValues = Omit<
  MaterialUpsertSchema,
  'yield_rate' | 'processing'
> & {
  yield_rate: string;
  processing?: string[];
};

export default function MaterialEditModal({
  visible,
  record,
  onCancel,
  onUpdated,
}: MaterialEditModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<MaterialEditFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trigger: updateMaterial } = useMaterialUpdate();
  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  const initialValues = useMemo(() => {
    if (!record) return undefined;

    return {
      name: record.name,
      category_id: record.category_id,
      yield_rate: decimalYieldRateToPercent(record.yield_rate),
      processing: record.processing?.map((method) => method.name) ?? [],
    };
  }, [record]);

  const handleOk = async () => {
    if (!record) {
      return;
    }

    try {
      const values = await form.validateFields();
      const processing = values.processing ?? [];

      const payload: MaterialUpsertSchema & { id: number } = {
        id: record.id,
        name: values.name,
        category_id: values.category_id,
        yield_rate: percentYieldRateToDecimal(values.yield_rate),
        processing,
      };

      setIsSubmitting(true);
      await updateMaterial(payload);
      message.success('更新食材成功');
      onUpdated?.();
      onCancel();
    } catch (error) {
      if (!(error instanceof Error)) {
        return;
      }
      message.error(error.message || '更新食材失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={'编辑食材'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnHidden
      confirmLoading={isSubmitting}
      okText={'保存'}
      cancelText={'取消'}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        preserve={false}
      >
        <Form.Item<MaterialEditFormValues>
          name="name"
          label={'名称'}
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder={'输入食材名称'} />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="category_id"
          label={'类别'}
          rules={[{ required: true, message: '请选择类别' }]}
        >
          <Select
            placeholder={'选择类别'}
            options={categoryOptions}
            loading={isLoadingCategories}
          />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="yield_rate"
          label={'出成率'}
          rules={[
            {
              required: true,
              message: '请输入出成率',
            },
            {
              validator: (_, value: string | undefined) => {
                if (value === undefined || value === '') {
                  return Promise.resolve();
                }

                if (!isValidYieldRatePercent(value)) {
                  return Promise.reject(
                    new Error('出成率必须在 0 到 100 之间'),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            stringMode
            min={0}
            max={100}
            step="1"
            suffix="%"
            className="w-full"
            placeholder={'例如：80'}
          />
        </Form.Item>
        <Form.Item<MaterialEditFormValues> name="processing" label={'加工规格'}>
          <Select
            mode="tags"
            dropdownStyle={{ display: 'none' }}
            placeholder={'例如：块、片、丝'}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
