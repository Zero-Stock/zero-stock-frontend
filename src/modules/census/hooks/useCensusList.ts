import useSWR from 'swr';
import { useMemo } from 'react';
import type { ApiListResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { CensusPreviewDto } from '../dtos/censusPreview.dto';

export interface CensusListPayload {
  date?: string;
  start?: string;
  end?: string;
  region_id?: number;
  diet_category_id?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export function useCensusList(payload?: CensusListPayload) {
  const key: SWRKey = {
    url: '/api/census/search/',
    method: 'POST',
    options: payload
      ? {
          body: {
            company: 1,
            ...payload,
          },
        }
      : {},
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiListResponseDto<CensusPreviewDto[]>>(key);

  const census = useMemo(() => {
    if (!data) return [];
    return data.results?.results;
  }, [data]);

  return {
    census,
    total: data?.results.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
