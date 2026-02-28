import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
} from 'antd';
import { useMemo } from 'react';
import { mockRawMaterials } from '@/modules/material/mockdata';
import {
  createSupplierWithMaterials,
  type SupplierMaterialInput,
} from '../mockdata';
import { useLocation } from 'wouter';

const { Title, Text } = Typography;

type FormValues = {
  name: string;
  contact: string;
  address: string;
  materials: Array<{
    rawMaterialId?: string;
    price?: number;
    unit?: string;
  }>;
};

export default function SupplierCreateForm() {
  const [, navigate] = useLocation();
  const [form] = Form.useForm<FormValues>();

  const rawMaterialOptions = useMemo(
    () =>
      mockRawMaterials.map((rm) => ({
        label: `${rm.name}（${rm.category}）`,
        value: rm.id,
      })),
    [],
  );

  const rawMaterialDefaultUnitById = useMemo(() => {
    const m = new Map<string, string>();
    mockRawMaterials.forEach((rm) => m.set(rm.id, rm.unit));
    return m;
  }, []);

  const onFinish = (values: FormValues) => {
    const materials: SupplierMaterialInput[] = (values.materials ?? []).map(
      (row) => ({
        rawMaterialId: row.rawMaterialId ?? '',
        price: Number(row.price ?? 0),
        unit: row.unit ?? '',
      }),
    );

    const created = createSupplierWithMaterials(
      {
        name: values.name,
        contact: values.contact,
        address: values.address,
      },
      materials,
    );

    message.success('Supplier created');
    navigate(`/supplier/${created.id}`);
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        materials: [{ rawMaterialId: undefined, price: undefined, unit: '' }],
      }}
    >
      {/* ===== 基础信息 ===== */}
      <Title level={4} style={{ marginTop: 0 }}>
        Basic Information
      </Title>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
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

        <Form.Item
          label="Contact"
          name="contact"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input placeholder="Phone / WeChat / Email" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input placeholder="Address" />
        </Form.Item>
      </div>

      {/* ===== 明细信息（类似你截图） ===== */}
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
          {/* 表头 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 120px',
              gap: 16,
              padding: '8px 8px 12px',
              fontWeight: 600,
            }}
          >
            <div>Raw Material</div>
            <div>Price</div>
            <div>Unit (Spec)</div>
            <div></div>
          </div>

          <Form.List name="materials">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div
                    key={field.key}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 120px',
                      gap: 16,
                      padding: '8px',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'rawMaterialId']}
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        placeholder="Select raw material"
                        options={rawMaterialOptions}
                        showSearch
                        optionFilterProp="label"
                        onChange={(val) => {
                          // 如果 unit 没填，就自动带上默认 unit（用户可改）
                          const current = form.getFieldValue([
                            'materials',
                            field.name,
                            'unit',
                          ]);
                          if (!current) {
                            form.setFieldValue(
                              ['materials', field.name, 'unit'],
                              rawMaterialDefaultUnitById.get(val) ?? '',
                            );
                          }
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'price']}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="e.g. 12.5"
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'unit']}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="e.g. {箱: 10kg}" />
                    </Form.Item>

                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button
                        danger
                        type="link"
                        onClick={() => remove(field.name)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 12 }}>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        rawMaterialId: undefined,
                        price: undefined,
                        unit: '',
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
        >
          Cancel
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          style={{ height: 40, borderRadius: 10 }}
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
