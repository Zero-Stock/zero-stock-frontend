export interface SupplierMaterialCreateDto {
  supplier: number;
  raw_material: number;
  unit_name?: string;
  kg_per_unit?: string;
  price?: string;
  notes?: string;
}
