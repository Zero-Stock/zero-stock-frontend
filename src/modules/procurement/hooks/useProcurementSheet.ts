import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  ProcurementQuerySchema,
  ProcurementSheetSchema,
} from '@/shared/types/schema';

export function useProcurementSheet(
  procurementId?: number,
  payload?: Pick<
    ProcurementQuerySchema,
    'category_id' | 'sort_by' | 'sort_order'
  >,
) {
  const key: SWRKey | null = procurementId
    ? {
        url: `/api/procurement/${procurementId}/sheet`,
        options: {
          query: payload,
        },
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ProcurementSheetSchema>>(key);

  const sheet = useMemo(() => {
    return data?.result;
  }, [data]);

  const items = useMemo(() => {
    return data?.result?.items ?? [];
  }, [data]);

  return {
    sheet,
    items,
    error,
    isLoading,
    mutate,
  };
}
