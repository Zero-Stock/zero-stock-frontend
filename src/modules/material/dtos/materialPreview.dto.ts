export interface MaterialSpec {
  id: number;
  method_name: string;
  yield_rate: string;
}

export interface MaterialPreviewDto {
  id: number;
  name: string;
  category: number;
  category_name: string;
  specs: MaterialSpec[];
}
