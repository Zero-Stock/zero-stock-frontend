export type ProcurementStatus = 'init' | 'pending' | 'completed';

export interface ProcurementPreviewDto {
  id: number;
  date: string;

  material_id: number;
  material_name: string;
  material_category?: string;

  demand_g: number;
  demand_special_unit: number | null;

  stock_g: number;
  stock_special_unit: number | null;

  required_g: number;
  required_special_unit: number | null;

  supplier_id: number | null;
  supplier_name: string | null;
  supplier_price: number | null;
  supplier_unit: string | null;

  available_suppliers?: {
    id: number;
    name: string;
  }[];

  status: ProcurementStatus;
  editable: boolean;
}
