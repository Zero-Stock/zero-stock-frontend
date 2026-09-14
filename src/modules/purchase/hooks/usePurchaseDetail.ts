import useSWR from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  PurchaseDetailSchema,
  PurchaseOrderSchema,
  PurchaseOrderListResponseSchema,
  PurchaseOrderQuerySchema,
  PurchaseRecordSchema,
} from '@/shared/types/schema';

export function usePurchaseDetail(
  id: number,
  payload: PurchaseOrderQuerySchema,
) {
  const valid = Number.isSafeInteger(id) && id > 0;
  const detailKey: SWRKey | null = valid
    ? { url: `/api/purchase/${id}` }
    : null;
  const detail = useSWR<ApiResponseDto<PurchaseDetailSchema>>(detailKey);
  const itemsKey: SWRKey | null = valid
    ? {
        url: `/api/purchase/${id}/items/list`,
        method: 'POST',
        options: { body: payload },
      }
    : null;
  const items =
    useSWR<ApiResponseDto<PurchaseOrderListResponseSchema>>(itemsKey);
  return {
    record: detail.data?.result,
    purchases: items.data?.result.list ?? [],
    total: items.data?.result.total ?? 0,
    isLoading: detail.isLoading || items.isLoading,
    error: detail.error ?? items.error,
    mutate: async () => {
      await Promise.all([detail.mutate(), items.mutate()]);
    },
    regenerate: async () => {
      const result = await apiClient.post<ApiResponseDto<PurchaseRecordSchema>>(
        `/api/purchase/${id}/regenerate`,
        {},
      );
      return result.result;
    },
    fetchAll: async () => {
      const rows: PurchaseOrderSchema[] = [];
      for (let page = 1; ; page += 1) {
        const result = await apiClient.post<
          ApiResponseDto<PurchaseOrderListResponseSchema>
        >(`/api/purchase/${id}/items/list`, {
          body: { ...payload, page, page_size: 1000 },
        });
        rows.push(...result.result.list);
        if (!result.result.list.length || rows.length >= result.result.total)
          return rows;
      }
    },
  };
}
