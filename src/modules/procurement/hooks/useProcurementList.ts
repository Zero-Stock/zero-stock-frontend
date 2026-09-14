import { apiClient } from '@/shared/api/apiClient.client';
import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import { useDateStore } from '@/shared/stores/dateStore';
import type {
  ProcurementPreviewSchema,
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
        needed_date: selectedDate,
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
    fetchAll: async () => {
      const rows: ProcurementPreviewSchema[] = [];
      for (let page = 1; ; page += 1) {
        const response = await apiClient.post<
          ApiResponseDto<ProcurementListResponseSchema>
        >('/api/procurement/list', {
          body: {
            company_id: 1,
            needed_date: selectedDate,
            ...payload,
            page,
            page_size: 1000,
          },
        });
        rows.push(...response.result.list);
        if (
          !response.result.list.length ||
          rows.length >= response.result.total
        )
          return rows;
      }
    },
    total: data?.result.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
