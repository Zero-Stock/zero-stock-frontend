import type { SupplierMaterialDto } from './supplierMaterial.dto';

export interface SupplierDetailDto {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  address: string;
  materials: SupplierMaterialDto[];
}
