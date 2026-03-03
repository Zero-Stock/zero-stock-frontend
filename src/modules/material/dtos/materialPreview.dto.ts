export interface MaterialSpec {
  id: number;
  method_name: string;
}

export interface MaterialPreviewDto {
  id: number;
  name: string;
  category: number;
  category_name: string;
  current_yield_rate: string;
  specs: MaterialSpec[];
}
