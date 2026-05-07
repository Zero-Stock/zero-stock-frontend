import type {
  ApiListResultDto as SchemaApiListResultDto,
  ApiResponseDto as SchemaApiResponseDto,
} from '@/shared/types/schema';

export type { ApiErrorDto } from '@/shared/types/schema';

export type ApiResponseDto<T> = Omit<SchemaApiResponseDto, 'result'> & {
  result: T;
};

export type ApiListResponseDto<T> = ApiResponseDto<
  Omit<SchemaApiListResultDto, 'list'> & { list: T }
>;
