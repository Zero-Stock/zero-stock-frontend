import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  PurchaseOrderItemListResponseSchema,
  PurchaseOrderQuerySchema,
} from '@/shared/types/schema';
export function usePurchaseSheet(
  id?: number,
  payload?: PurchaseOrderQuerySchema,
) {
  const key: SWRKey | null = id
    ? {
        url: `/api/purchase/${id}/items/list`,
        method: 'POST',
        options: { body: { page_size: 10000, ...payload } },
      }
    : null;
  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<PurchaseOrderItemListResponseSchema>>(key);
  return { items: data?.result.list ?? [], error, isLoading, mutate };
}
