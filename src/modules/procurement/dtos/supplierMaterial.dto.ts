export interface SupplierMaterialDto {
  id: number;
  supplier_id: number;
  supplier_name: string;
  material_id: number;
  material_name: string;
  unit_name: string;
  g_per_unit: string;
  price_per_unit: string | null;
  notes: string;
}
