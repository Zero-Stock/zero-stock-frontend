export interface ProcessedMaterialDto {
  id: number;
  method_name: string;
  yield_rate: string;
}

export interface RawMaterialDto {
  id: number;
  name: string;
  category: number | null;
  category_name: string | null;
  specs: ProcessedMaterialDto[];
}
