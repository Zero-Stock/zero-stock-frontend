export interface SupplierMaterialDto {
  id: number;
  supplier: number;
  supplier_name: string;
  raw_material: number;
  raw_material_name: string;
  unit_name: string;
  kg_per_unit: string;
  price: string | null;
  notes: string;
}
