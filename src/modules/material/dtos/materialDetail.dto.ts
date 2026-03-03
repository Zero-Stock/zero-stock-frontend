export interface MaterialSpecDto {
  id: number;
  method_name: string;
}

export interface MaterialDetailDto {
  id: number;
  name: string;
  category: number;
  category_name: string;
  yield_rate: string;
  specs: MaterialSpecDto[];
}
