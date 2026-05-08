import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { useMemo, useState } from 'react';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useMaterialUpdate } from '../hooks/useMaterialUpdate';
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
  'id' | 'yield_rate' | 'processing'
> & {
  id?: MaterialUpsertSchema['id'];
  yield_rate: number;
  processing?: string;
};

export default function MaterialEditModal({
  visible,
  record,
  onCancel,
  onUpdated,
}: MaterialEditModalProps) {
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
      yield_rate: Number(record.yield_rate ?? 0),
      processing:
        record.processing?.map((method) => method.name).join(', ') ?? '',
    };
  }, [record]);

  const handleOk = async () => {
    if (!record) {
      return;
    }

    try {
      const values = await form.validateFields();
      const processing = values.processing
        ? values.processing
            .split(',')
            .map((methodName) => methodName.trim())
            .filter(Boolean)
        : [];

      const payload: Omit<MaterialUpsertSchema, 'id'> & { id: number } = {
        id: record.id,
        name: values.name,
        category_id: values.category_id,
        yield_rate: String(values.yield_rate),
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
              type: 'number',
              min: 0,
              max: 1,
            },
          ]}
        >
          <InputNumber
            min={0}
            max={1}
            step={0.01}
            className="w-full"
            placeholder={t('materialYieldRatePlaceholder')}
          />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="processing"
          label={t('commonSpecs')}
        >
          <Input placeholder={t('materialSpecsPlaceholder')} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
