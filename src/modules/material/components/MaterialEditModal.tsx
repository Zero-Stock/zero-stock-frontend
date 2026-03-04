import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { useMemo, useState } from 'react';
import type { MaterialUpdateDto } from '../dtos/materialUpdate.dto';
import { type MaterialPreviewDto } from '../dtos/materialPreview.dto';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useMaterialUpdate } from '../hooks/useMaterialUpdate';
import { useTranslation } from '@/shared/i18n/LanguageContext';

interface MaterialEditModalProps {
  visible: boolean;
  record: MaterialPreviewDto | null;
  onCancel: () => void;
  onUpdated?: () => void;
}

interface MaterialEditFormValues {
  id: number;
  name: string;
  category: number;
  yield_rate: number;
  specs?: string;
}

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
      category: record.category,
      yield_rate: Number(record.current_yield_rate ?? 0),
      specs: record.specs?.map((spec) => spec.method_name).join(', ') ?? '',
    };
  }, [record]);

  const handleOk = async () => {
    if (!record) {
      return;
    }

    try {
      const values = await form.validateFields();
      const specs = values.specs
        ? values.specs
            .split(',')
            .map((spec) => spec.trim())
            .filter(Boolean)
            .map((method_name) => ({ method_name }))
        : [];

      const payload: MaterialUpdateDto = {
        id: record.id,
        name: values.name,
        category: values.category,
        yield_rate: values.yield_rate,
        specs,
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
          label={t('materialNameLabel')}
          rules={[{ required: true, message: t('materialNameRequired') }]}
        >
          <Input placeholder={t('materialNamePlaceholder')} />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="category"
          label={t('materialCategoryLabel')}
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
          label={t('materialYieldRateLabel')}
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
          name="specs"
          label={t('materialSpecsLabel')}
        >
          <Input placeholder={t('materialSpecsPlaceholder')} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
