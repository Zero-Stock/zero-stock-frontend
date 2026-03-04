export interface SupplierMaterialUpdateDto {
  id: number;
  supplier?: number;
  raw_material?: number;
  unit_name?: string;
  kg_per_unit?: string;
  price?: string | null;
  notes?: string;
}
