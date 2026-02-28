import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { useMemo, useState } from 'react';
import { mockRawMaterials } from '@/modules/material/mockdata';
import {
  deleteSupplierMaterialPriceLocal,
  getSupplierMaterialPricesBySupplierId,
  upsertSupplierMaterialPriceLocal,
  type SupplierMaterialPrice,
} from '../mockdata';
import MaterialPriceEditModal from './MaterialPriceEditModal';

const { Title } = Typography;

type Row = SupplierMaterialPrice & {
  rawMaterialName: string;
  defaultUnit: string;
};

export default function SupplierMaterialTable({
  supplierId,
}: {
  supplierId: string;
}) {
  const [rows, setRows] = useState<SupplierMaterialPrice[]>(
    getSupplierMaterialPricesBySupplierId(supplierId),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SupplierMaterialPrice | null>(null);

  const [keyword, setKeyword] = useState('');

  const rawMaterialById = useMemo(() => {
    const m = new Map<string, { name: string; unit: string }>();
    mockRawMaterials.forEach((rm) =>
      m.set(rm.id, { name: rm.name, unit: rm.unit }),
    );
    return m;
  }, []);

  const tableData: Row[] = useMemo(() => {
    return rows.map((r) => {
      const info = rawMaterialById.get(r.rawMaterialId);
      return {
        ...r,
        rawMaterialName: info?.name ?? '(Unknown)',
        defaultUnit: info?.unit ?? '',
      };
    });
  }, [rows, rawMaterialById]);

  // ✅ Search filter: by rawMaterialId or rawMaterialName
  const filteredData: Row[] = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return tableData;

    return tableData.filter((row) => {
      const idStr = String(row.rawMaterialId ?? '').toLowerCase();
      const nameStr = String(row.rawMaterialName ?? '').toLowerCase();
      return idStr.includes(kw) || nameStr.includes(kw);
    });
  }, [tableData, keyword]);

  const existingIds = useMemo(
    () => new Set(rows.map((r) => r.rawMaterialId)),
    [rows],
  );

  const columns = [
    {
      title: 'Raw Material ID',
      dataIndex: 'rawMaterialId',
      key: 'rawMaterialId',
      width: 150,
      sorter: (a: Row, b: Row) =>
        Number(a.rawMaterialId) - Number(b.rawMaterialId),
      defaultSortOrder: 'ascend' as const,
    },
    { title: 'Name', dataIndex: 'rawMaterialName', key: 'rawMaterialName' },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      sorter: (a: Row, b: Row) => a.price - b.price,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 180,
      render: (_: any, record: Row) => record.unit || record.defaultUnit || '',
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 200,
      render: (_: any, record: Row) => (
        <Space size="middle">
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              setEditing(record);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this material price?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={() => {
              deleteSupplierMaterialPriceLocal(
                record.supplierId,
                record.rawMaterialId,
              );
              setRows(getSupplierMaterialPricesBySupplierId(supplierId));
              message.success('Deleted');
            }}
          >
            <Button type="link" danger style={{ padding: 0 }}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Material Prices
        </Title>

        <Space>
          <Input.Search
            allowClear
            placeholder="Search by Raw Material ID or Name"
            style={{ width: 320 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <Button
            type="primary"
            onClick={() => {
              setEditing(null); // add mode
              setModalOpen(true);
            }}
          >
            Add Material
          </Button>
        </Space>
      </Space>

      <Table<Row>
        rowKey={(r) => `${r.supplierId}-${r.rawMaterialId}`}
        columns={columns as any}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
      />

      <MaterialPriceEditModal
        open={modalOpen}
        supplierId={supplierId}
        existingRawMaterialIds={existingIds}
        editing={editing}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={(next) => {
          upsertSupplierMaterialPriceLocal(next);
          setRows(getSupplierMaterialPricesBySupplierId(supplierId));
          message.success(editing ? 'Updated' : 'Added');
          setModalOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
