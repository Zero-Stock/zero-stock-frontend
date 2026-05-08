import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierListResponseSchema,
  SupplierQuerySchema,
} from '@/shared/types/schema';

export function useSupplierList(payload?: SupplierQuerySchema) {
  const key: SWRKey = {
    url: '/api/suppliers/list',
    method: 'POST',
    options: {
      body: payload ?? {},
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<SupplierListResponseSchema>>(key);

  return {
    suppliers: data?.result.list ?? [],
    total: data?.result?.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
