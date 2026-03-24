import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiListResponseDto } from '@/shared/dtos/apiResponse.dto';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ProcurementPreviewDto } from '../dtos/procurementPreview.dto';

export interface ProcurementListPayload {
  date?: string;
  start?: string;
  end?: string;
  status?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export function useProcurementList(payload?: ProcurementListPayload) {
  const selectedDate = useDateStore((state) => state.date);

  const key: SWRKey = {
    url: '/api/procurement/search/',
    method: 'POST',
    date: selectedDate,
    options: {
      body: {
        company: 1,
        ...payload,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiListResponseDto<ProcurementPreviewDto[]>>(key);

  const procurements = useMemo(() => {
    if (!data) return [];
    return data.results?.results;
  }, [data]);

  return {
    procurements,
    total: data?.results.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
