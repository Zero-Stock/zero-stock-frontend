export interface ProcurementSheetItemDto {
  material_id: number;
  name: string;
  category: string;

  demand_kg: number;
  demand_unit_qty: number | null;

  stock_kg: number;
  stock_unit_qty: number | null;

  purchase_kg: number;
  purchase_unit_qty: number | null;

  supplier: string | null;
  supplier_unit_name: string | null;
  supplier_kg_per_unit: number | null;
  supplier_price: number | null;
}

export interface ProcurementSheetDto {
  id: number;
  date: string;
  day_of_week: string;
  company: string;
  status: string;
  items: ProcurementSheetItemDto[];
}
