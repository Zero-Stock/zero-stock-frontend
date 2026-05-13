import { App, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useMemo, useState } from 'react';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useMaterialUpdate } from '../hooks/useMaterialUpdate';
import {
  decimalYieldRateToPercent,
  isValidYieldRatePercent,
  percentYieldRateToDecimal,
} from '../utils/yieldRate';
import { useTranslation } from '@/shared/translation/LanguageContext';
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
  const { t } = useTranslation();
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
      message.success(t('materialEditSuccess'));
      onUpdated?.();
      onCancel();
    } catch (error) {
      if (!(error instanceof Error)) {
        return;
      }
      message.error(error.message || t('materialEditFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={t('materialEditTitle')}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnHidden
      confirmLoading={isSubmitting}
      okText={t('save')}
      cancelText={t('cancel')}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        preserve={false}
      >
        <Form.Item<MaterialEditFormValues>
          name="name"
          label={t('commonName')}
          rules={[{ required: true, message: t('materialNameRequired') }]}
        >
          <Input placeholder={t('materialNamePlaceholder')} />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="category_id"
          label={t('commonCategory')}
          rules={[{ required: true, message: t('materialCategoryRequired') }]}
        >
          <Select
            placeholder={t('materialCategoryPlaceholder')}
            options={categoryOptions}
            loading={isLoadingCategories}
          />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="yield_rate"
          label={t('commonYieldRate')}
          rules={[
            {
              required: true,
              message: t('materialYieldRateRequired'),
            },
            {
              validator: (_, value: string | undefined) => {
                if (value === undefined || value === '') {
                  return Promise.resolve();
                }

                if (!isValidYieldRatePercent(value)) {
                  return Promise.reject(
                    new Error(t('materialYieldRateRange')),
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
            placeholder={t('materialYieldRatePlaceholder')}
          />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="processing"
          label={t('commonSpecs')}
        >
          <Select
            mode="tags"
            dropdownStyle={{ display: 'none' }}
            placeholder={t('materialSpecsPlaceholder')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
