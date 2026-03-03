import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import type { MaterialUpdateDto } from '../dtos/materialUpdate.dto';
import { type MaterialPreviewDto } from '../dtos/materialPreview.dto';
import useMaterialCategories from '../hooks/useMaterialCategories';
import { useMaterialUpdate } from '../hooks/useMaterialUpdate';

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
  specs: string;
}

export default function MaterialEditModal({
  visible,
  record,
  onCancel,
  onUpdated,
}: MaterialEditModalProps) {
  const [form] = Form.useForm<MaterialEditFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trigger: updateMaterial } = useMaterialUpdate();
  const { categoryOptions, isLoading: isLoadingCategories } =
    useMaterialCategories();

  useEffect(() => {
    if (!visible || !record) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      id: record.id,
      name: record.name,
      category: record.category,
      yield_rate: Number(record.current_yield_rate ?? 0),
      specs: record.specs.map((spec) => spec.method_name).join(', '),
    });
  }, [form, record, visible]);

  const handleOk = async () => {
    if (!record) {
      return;
    }

    try {
      const values = await form.validateFields();
      const specs = values.specs
        .split(',')
        .map((spec) => spec.trim())
        .filter(Boolean)
        .map((method_name) => ({ method_name }));

      const payload: MaterialUpdateDto = {
        id: record.id,
        name: values.name,
        category: values.category,
        yield_rate: values.yield_rate,
        specs,
      };

      setIsSubmitting(true);
      await updateMaterial(payload);
      message.success('Raw material updated');
      onUpdated?.();
      onCancel();
    } catch (error) {
      if (!(error instanceof Error)) {
        return;
      }
      message.error(error.message || 'Failed to update raw material');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Edit Raw Material"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnHidden
      confirmLoading={isSubmitting}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item<MaterialEditFormValues> name="id" label="ID">
          <Input disabled />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input name' }]}
        >
          <Input placeholder="Input raw material name" />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select
            placeholder="Select category"
            options={categoryOptions}
            loading={isLoadingCategories}
          />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="yield_rate"
          label="Yield Rate"
          rules={[
            {
              required: true,
              message: 'Please input yield rate',
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
            placeholder="e.g. 0.8"
          />
        </Form.Item>
        <Form.Item<MaterialEditFormValues>
          name="specs"
          label="Specs"
          rules={[
            { required: true, message: 'Please input specs' },
            {
              validator: async (_, value) => {
                const hasSpecs =
                  typeof value === 'string' &&
                  value
                    .split(',')
                    .map((spec) => spec.trim())
                    .filter(Boolean).length > 0;

                if (!hasSpecs) {
                  throw new Error('Please input at least one spec');
                }
              },
            },
          ]}
        >
          <Input placeholder="e.g. chunk, slice, shred" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
