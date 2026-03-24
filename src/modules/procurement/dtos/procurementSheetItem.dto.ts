export interface SupplierOptionDto {
  supplier_material_id: number;
  supplier_name: string;
  price: number | null;
  unit_name: string | null;
  kg_per_unit: number | null;
}

export interface ProcurementSheetItemDto {
  id?: number;
  item_id?: number;

  name: string;
  category: string;

  demand_kg: number;
  demand_unit_qty: number;

  stock_kg: number;
  stock_unit_qty: number;

  purchase_kg: number;
  purchase_unit_qty: number;

  supplier: string | null;
  supplier_unit_name: string | null;

  selected_supplier_material_id?: number | null;
  available_suppliers?: SupplierOptionDto[];
}
