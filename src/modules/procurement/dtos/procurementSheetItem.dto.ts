export interface ProcurementSheetItemDto {
  material_id: number;
  name: string;
  category: string;

  demand_g: number;
  demand_unit_qty: number | null;

  stock_g: number;
  stock_unit_qty: number | null;

  purchase_g: number;
  purchase_unit_qty: number | null;

  supplier: string | null;
  supplier_unit_name: string | null;
  supplier_g_per_unit: number | null;
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
