import useSWR from 'swr';
import type { MaterialPreviewDto } from '../dtos/materialPreview.dto';
import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiListResponseDto } from '@/shared/dtos/apiResponse.dto';

export interface MaterialListPayload {
  name?: string;
  category?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export function useMaterialList(payload?: MaterialListPayload) {
  const { data, error, isLoading, mutate } = useSWR<MaterialPreviewDto[]>(
    ['/api/materials/search/', payload ?? {}],
    async ([path, payload]) => {
      const res = await apiClient.get<ApiListResponseDto<MaterialPreviewDto[]>>(
        path,
        {
          body: payload,
        },
      );
      return res.results;
    },
  );

  return {
    materials: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
