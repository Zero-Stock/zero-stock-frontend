import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import { useDateStore } from '@/shared/stores/dateStore';
import type {
  ProcurementListResponseSchema,
  ProcurementQuerySchema,
} from '@/shared/types/schema';

export function useProcurementList(payload?: ProcurementQuerySchema) {
  const selectedDate = useDateStore((state) => state.date);

  const key: SWRKey = {
    url: '/api/procurement/list',
    method: 'POST',
    date: selectedDate,
    options: {
      body: {
        company_id: 1,
        ...payload,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ProcurementListResponseSchema>>(key);

  const procurements = useMemo(() => {
    if (!data) return [];
    return data.result?.list ?? [];
  }, [data]);

  return {
    procurements,
    total: data?.result.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
