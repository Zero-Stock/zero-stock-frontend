import type { ApiErrorDto } from '@/shared/types/schema';

export type { ApiErrorDto } from '@/shared/types/schema';

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
