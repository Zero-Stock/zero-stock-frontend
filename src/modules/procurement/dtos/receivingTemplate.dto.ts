export interface ReceivingTemplateItemDto {
  material_id: number;
  material_name: string;
  expected_quantity: number;
  actual_quantity: number;
}

export interface ReceivingTemplateDto {
  procurement_id: number;
  target_date: string;
  status: string;
  items: ReceivingTemplateItemDto[];
}
