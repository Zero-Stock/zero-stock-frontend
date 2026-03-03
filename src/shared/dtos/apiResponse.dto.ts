export interface ApiErrorDto {
  type: string;
  details: string;
}

export interface ApiResponseDto<T> {
  results: T;
  message: string;
  error: ApiErrorDto | null;
}

export interface ApiListResponseDto<T> {
  results: {
    page: number;
    page_size: number;
    total: number;
    results: T;
  };
  message: string;
  error: ApiErrorDto | null;
}
