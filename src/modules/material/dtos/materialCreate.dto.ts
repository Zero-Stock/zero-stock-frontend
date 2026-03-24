export interface MaterialSpecCreateDto {
  method_name: string;
}

export interface MaterialCreateDto {
  name: string;
  category: number;
  yield_rate: string;
  specs: MaterialSpecCreateDto[];
}
