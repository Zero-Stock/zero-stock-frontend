import type { ProcurementStatus } from './procurementPreview.dto';

export interface ReceivingPreviewDto {
  id: number;
  date: string;

  material_id: number;
  material_name: string;
  material_category?: string;

  supplier_id: number | null;
  supplier_name: string | null;

  required_kg: number;
  required_special_unit: number;

  actual_received_kg: number | null;
  actual_received_special_unit: number | null;

  status: ProcurementStatus;
  editable: boolean;
}
