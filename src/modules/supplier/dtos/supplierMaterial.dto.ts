export interface SupplierMaterialDto {
  id: number;
  raw_material: number;
  raw_material_name: string;
  unit_name: string;
  kg_per_unit: string;
  price: string;
  notes?: string | null;
}
