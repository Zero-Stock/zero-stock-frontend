import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { PurchaseDetailSchema } from '@/shared/types/schema';

export function usePurchaseDetail(id: number) {
  const key: SWRKey | null =
    Number.isSafeInteger(id) && id > 0
      ? { url: `/api/purchase/${id}`, method: 'GET' }
      : null;
  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<PurchaseDetailSchema>>(key);

  return { record: data?.result, error, isLoading, mutate };
}
