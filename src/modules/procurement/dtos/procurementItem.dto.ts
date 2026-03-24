export interface ProcurementItemDto {
  id: number;
  raw_material: number;
  raw_material_name: string;
  category: string;

  demand_quantity: string;
  stock_quantity: string;
  purchase_quantity: string;

  demand_unit_qty: number | null;
  stock_unit_qty: number | null;
  purchase_unit_qty: number | null;

  supplier: number | null;
  supplier_name: string | null;
  supplier_unit_name: string | null;
  supplier_kg_per_unit: string | null;
  supplier_price: string | null;

  notes: string;
}
