import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
} from 'antd';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMaterialList } from '@/modules/material/hooks/useMaterialList';
import { useSupplierCreate } from '../hooks/useSupplierCreate';
import { useSupplierMaterialCreate } from '../hooks/useSupplierMaterialCreate';
import type { SupplierCreateDto } from '../dtos/supplierCreate.dto';

const { Title, Text } = Typography;

type FormValues = {
  name: string;
  contact_person: string;
  phone: string;
  address: string;
  materials: Array<{
    rawMaterialId?: number;
    price?: number;
    unit?: string;
    kg_per_unit?: number;
  }>;
};

export default function SupplierCreateForm() {
  const [, navigate] = useLocation();
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { materialOptions } = useMaterialList();
  const { trigger: createSupplier } = useSupplierCreate();
  const { trigger: createMaterial } = useSupplierMaterialCreate();

  const onFinish = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload: SupplierCreateDto = {
        name: values.name,
        contact_person: values.contact_person,
        phone: values.phone,
        address: values.address,
      };

      const createdSupplier = await createSupplier(payload);
      const supplierId =
        (createdSupplier as any).results?.id || (createdSupplier as any).id;

      if (!supplierId) {
        message.error('Error retrieving created supplier ID.');
        return;
      }

      // Create materials if any
      const mRows = values.materials || [];
      for (const row of mRows) {
        if (row.rawMaterialId) {
          try {
            await createMaterial({
              supplier: supplierId,
              raw_material: row.rawMaterialId,
              unit_name: row.unit || 'kg',
              kg_per_unit: String(row.kg_per_unit || 1),
              price: String(row.price || 0),
            });
          } catch (err) {
            console.error(err);
            message.warning(`Failed to add material ${row.rawMaterialId}`);
          }
        }
      }

      message.success('Supplier created');
      navigate(`/supplier/${supplierId}`);
    } catch (err) {
      console.error(err);
      message.error('Failed to create supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        materials: [
          {
            rawMaterialId: undefined,
            price: undefined,
            unit: '',
            kg_per_unit: undefined,
          },
        ],
      }}
    >
      {/* ===== 基础信息 ===== */}
      <Title level={4} style={{ marginTop: 0 }}>
        Basic Information
      </Title>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 16,
          maxWidth: 1100,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input placeholder="Supplier name" />
        </Form.Item>

        <Form.Item label="Contact Person" name="contact_person">
          <Input placeholder="Contact person name" />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input placeholder="Phone number" />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input placeholder="Address" />
        </Form.Item>
      </div>

      {/* ===== 明细信息 ===== */}
      <div style={{ marginTop: 24 }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          Raw Material Details
        </Title>
        <Text type="secondary">
          Optional. You can add materials now, or edit later in the supplier
          detail page.
        </Text>

        <div
          style={{
            marginTop: 16,
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 12,
            padding: 16,
            maxWidth: 1100,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
              gap: 16,
              padding: '8px 8px 12px',
              fontWeight: 600,
            }}
          >
            <div>Raw Material</div>
            <div>Price</div>
            <div>Unit (Spec)</div>
            <div>kg/unit</div>
            <div></div>
          </div>

          <Form.List name="materials">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                      gap: 16,
                      padding: '8px',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'rawMaterialId']}
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        placeholder="Select raw material"
                        options={materialOptions}
                        showSearch
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="e.g. 12.5"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'unit']}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="e.g. 箱 / 袋" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'kg_per_unit']}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        min={0}
                        step={0.01}
                        style={{ width: '100%' }}
                        placeholder="e.g. 10"
                      />
                    </Form.Item>

                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button
                        danger
                        type="link"
                        onClick={() => remove(name)} // <-- Use 'name' here
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add button remains the same */}
                <div style={{ marginTop: 12 }}>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        rawMaterialId: undefined,
                        price: undefined,
                        unit: '',
                        kg_per_unit: undefined,
                      })
                    }
                    style={{ width: '100%', height: 44, borderRadius: 10 }}
                  >
                    + Add New Row
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          maxWidth: 1100,
        }}
      >
        <Button
          style={{ height: 40, borderRadius: 10 }}
          onClick={() => {
            navigate('/supplier');
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          style={{ height: 40, borderRadius: 10 }}
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
