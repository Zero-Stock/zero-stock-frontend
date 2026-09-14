import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  PurchaseListResponseSchema,
  PurchaseQuerySchema,
} from '@/shared/types/schema';

export function usePurchaseList(payload: PurchaseQuerySchema = {}) {
  const key: SWRKey = {
    url: '/api/purchase/list',
    method: 'POST',
    options: { body: payload },
  };
  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<PurchaseListResponseSchema>>(key);
  return {
    purchases: data?.result.list ?? [],
    total: data?.result.total ?? 0,
    isLoading,
    error,
    mutate,
  };
}
