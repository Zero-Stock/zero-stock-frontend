export interface ProcurementUpdateItemDto {
  id: number;
  supplier_id: number | null;
}

export interface ProcurementUpdateDto {
  date: string;
  items: ProcurementUpdateItemDto[];
}
