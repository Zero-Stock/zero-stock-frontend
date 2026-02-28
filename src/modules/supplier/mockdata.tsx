export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
}

export interface SupplierMaterialPrice {
  supplierId: string;
  rawMaterialId: string;
  price: number;
  unit: string; // '' 表示用默认单位
}

export type SupplierMaterialInput = Omit<SupplierMaterialPrice, 'supplierId'>;

// -------- In-memory DB --------
let suppliersDb: Supplier[] = [
  {
    id: '1',
    name: '海鲜供应商A',
    contact: '138-0000-0001',
    address: 'Toronto',
  },
  {
    id: '2',
    name: '粮油供应商B',
    contact: '138-0000-0002',
    address: 'Waterloo',
  },
  {
    id: '3',
    name: '综合供应商C',
    contact: '138-0000-0003',
    address: 'Markham',
  },
];

let pricesDb: SupplierMaterialPrice[] = [
  { supplierId: '1', rawMaterialId: '1', price: 28.5, unit: '' },
  { supplierId: '1', rawMaterialId: '3', price: 19.9, unit: '{kg}' },
  { supplierId: '2', rawMaterialId: '2', price: 52, unit: '{袋: 25kg}' },
  { supplierId: '3', rawMaterialId: '1', price: 27.8, unit: '' },
  { supplierId: '3', rawMaterialId: '4', price: 9.9, unit: '{筐: 15kg}' },
];

// -------- Supplier CRUD --------
export function listSuppliers(): Supplier[] {
  return [...suppliersDb];
}

export function getSupplierById(id: string): Supplier | null {
  const key = String(id).trim();
  return suppliersDb.find((s) => String(s.id) === key) ?? null;
}

export function createSupplier(input: Omit<Supplier, 'id'>): Supplier {
  const maxId = suppliersDb.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0);
  const id = String(maxId + 1);
  const created: Supplier = { id, ...input };
  suppliersDb = [...suppliersDb, created];
  return created;
}

export function updateSupplier(next: Supplier): Supplier {
  suppliersDb = suppliersDb.map((s) => (s.id === next.id ? next : s));
  return next;
}

export function deleteSupplier(id: string): void {
  suppliersDb = suppliersDb.filter((s) => s.id !== id);
  pricesDb = pricesDb.filter((p) => p.supplierId !== id);
}

// -------- Material Prices --------
export function getSupplierMaterialPricesBySupplierId(
  supplierId: string,
): SupplierMaterialPrice[] {
  const key = String(supplierId).trim();
  return pricesDb.filter((x) => String(x.supplierId) === key);
}

export function upsertSupplierMaterialPriceLocal(next: SupplierMaterialPrice) {
  const idx = pricesDb.findIndex(
    (x) =>
      x.supplierId === next.supplierId &&
      x.rawMaterialId === next.rawMaterialId,
  );
  if (idx >= 0) pricesDb[idx] = next;
  else pricesDb.push(next);
}

export function createSupplierWithMaterials(
  input: Omit<Supplier, 'id'>,
  materials: SupplierMaterialInput[],
) {
  const created = createSupplier(input);

  const normalized: SupplierMaterialPrice[] = (materials ?? [])
    .filter((m) => m.rawMaterialId)
    .map((m) => ({
      supplierId: created.id,
      rawMaterialId: String(m.rawMaterialId),
      price: Number(m.price ?? 0),
      unit: m.unit ?? '',
    }));

  pricesDb = [...pricesDb, ...normalized];
  return created;
}

export function deleteSupplierMaterialPriceLocal(
  supplierId: string,
  rawMaterialId: string,
) {
  pricesDb = pricesDb.filter(
    (p) => !(p.supplierId === supplierId && p.rawMaterialId === rawMaterialId),
  );
}
