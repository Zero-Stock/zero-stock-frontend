export interface ReceivingUpdateItemDto {
  id: number;
  actual_received_g: number | null;
  actual_received_special_unit: number | null;
}

export interface ReceivingUpdateDto {
  date: string;
  items: ReceivingUpdateItemDto[];
}
