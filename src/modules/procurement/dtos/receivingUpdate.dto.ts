export interface ReceivingUpdateItemDto {
  id: number;
  actual_received_kg: number | null;
  actual_received_special_unit: number | null;
}

export interface ReceivingUpdateDto {
  date: string;
  items: ReceivingUpdateItemDto[];
}
