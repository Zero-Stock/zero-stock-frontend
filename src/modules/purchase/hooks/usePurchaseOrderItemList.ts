import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  PurchaseOrderItemListResponseSchema,
  PurchaseOrderQuerySchema,
} from '@/shared/types/schema';

export function usePurchaseOrderItemList(
  id?: number,
  payload?: PurchaseOrderQuerySchema,
) {
  const key: SWRKey | null =
    id && Number.isSafeInteger(id) && id > 0
      ? {
          url: `/api/purchase/${id}/items`,
          method: 'POST',
          options: { body: { page_size: 10000, ...payload } },
        }
      : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<PurchaseOrderItemListResponseSchema>>(key);

  return {
    items: data?.result.list ?? [],
    total: data?.result.total ?? 0,
    error,
    isLoading,
    mutate,
  };
}
