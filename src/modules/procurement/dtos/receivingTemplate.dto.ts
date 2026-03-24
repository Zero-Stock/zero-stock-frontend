export interface ReceivingTemplateItemDto {
  raw_material_id: number;
  raw_material_name: string;
  expected_quantity: number;
  actual_quantity: number;
}

export interface ReceivingTemplateDto {
  procurement_id: number;
  target_date: string;
  status: string;
  items: ReceivingTemplateItemDto[];
}
