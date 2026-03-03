export interface ApiResponseDto<T> {
  results: T;
  message: string;
  error: string;
}

export interface ApiListResponseDto<T> extends ApiResponseDto<T> {
  page: number;
  page_size: number;
  total: number;
}
