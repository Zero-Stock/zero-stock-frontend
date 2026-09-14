import { App, Button, Form, Input, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useSupplierCreate } from '../hooks/useSupplierCreate';
import { useSupplierUpdate } from '../hooks/useSupplierUpdate';
import SupplierCreateMaterialTable from './SupplierCreateMaterialTable';
import type {
  SupplierMaterialUpsertSchema,
  SupplierUpsertSchema,
} from '@/shared/types/schema';
import { kgToGrams } from '../utils/supplierMaterialUnit';

const { Title, Text } = Typography;

type SupplierUpsertFormValues = Omit<SupplierUpsertSchema, 'materials'> & {
  materials?: Partial<SupplierMaterialUpsertSchema>[];
};

interface SupplierUpsertFormProps {
  supplierId?: number;
  initValues?: SupplierUpsertSchema;
}

const emptyMaterialRow: Partial<SupplierMaterialUpsertSchema> = {
  price_per_unit: undefined,
  unit_name: '',
  g_per_unit: undefined,
};

export default function SupplierUpsertForm({
  supplierId,
  initValues,
}: SupplierUpsertFormProps) {
  const { message } = App.useApp();
  const [, navigate] = useLocation();
  const [form] = Form.useForm<SupplierUpsertFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trigger: createSupplier } = useSupplierCreate();
  const { trigger: updateSupplier } = useSupplierUpdate();

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue({
        ...initValues,
        materials: initValues.materials?.length
          ? initValues.materials.map((material) => ({
              ...material,
              g_per_unit: material.g_per_unit
                ? String(Number(material.g_per_unit) / 1000)
                : undefined,
            }))
          : [emptyMaterialRow],
      });
    }
  }, [form, initValues]);

  const onFinish = async (values: SupplierUpsertFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: SupplierUpsertSchema = {
        name: values.name,
        contact_person: values.contact_person,
        phone: values.phone,
        address: values.address,
        materials: values.materials?.map((row) => ({
          material_id: row.material_id!,
          unit_name: row.unit_name || 'kg',
          g_per_unit: kgToGrams(row.g_per_unit) ?? '1000',
          price_per_unit: row.price_per_unit ?? '0',
          notes: row.notes,
          is_default: row.is_default,
        })),
      };

      if (supplierId) {
        await updateSupplier(supplierId, payload);
        message.success('供应商已更新');
        navigate(`/supplier/${supplierId}`);
        return;
      }

      const createdSupplier = await createSupplier(payload);
      const nextSupplierId = createdSupplier.result.id;

      if (!nextSupplierId) {
        message.error('获取创建的供应商 ID 失败。');
        return;
      }
      message.success('供应商已创建');
      navigate(`/supplier/${nextSupplierId}`);
    } catch (err) {
      console.error(err);
      message.error(supplierId ? '更新供应商失败' : '创建供应商失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<SupplierUpsertFormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        materials: [emptyMaterialRow],
      }}
    >
      <Title level={4}>{'基础信息'}</Title>

      <div className="grid w-full grid-cols-4 gap-4">
        <Form.Item
          label={'名称'}
          name="name"
          rules={[{ required: true, message: '必填' }]}
        >
          <Input placeholder={'供应商名称'} />
        </Form.Item>

        <Form.Item label={'联系人'} name="contact_person">
          <Input placeholder={'联系人名称'} />
        </Form.Item>

        <Form.Item label={'电话'} name="phone">
          <Input placeholder={'电话号码'} />
        </Form.Item>

        <Form.Item label={'地址'} name="address">
          <Input placeholder={'地址'} />
        </Form.Item>
      </div>

      <div className="mt-6">
        <Title level={4} className="mb-1">
          {'食材明细'}
        </Title>
        <Text type="secondary">
          {'可选。您可以在此处维护该供应商提供的食材。'}
        </Text>

        <div className="mt-4 max-w-275">
          <SupplierCreateMaterialTable />
        </div>
      </div>

      <div className="mt-6 flex w-full justify-end gap-3">
        <Button
          onClick={() => {
            navigate('/supplier');
          }}
          disabled={isSubmitting}
        >
          {'取消'}
        </Button>

        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {'保存'}
        </Button>
      </div>
    </Form>
  );
}
