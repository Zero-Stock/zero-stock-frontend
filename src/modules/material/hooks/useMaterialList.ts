import useSWR from 'swr';
import { useMemo } from 'react';
import type { MaterialPreviewDto } from '../dtos/materialPreview.dto';
import type { ApiListResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';

export interface MaterialListPayload {
  name?: string;
  category?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export function useMaterialList(payload?: MaterialListPayload) {
  const key: SWRKey = {
    url: '/api/materials/search/',
    method: 'POST',
    options: payload
      ? {
          body: payload,
        }
      : {},
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiListResponseDto<MaterialPreviewDto[]>>(key);

  const materials = useMemo(() => {
    if (!data) return [];
    return data.results.results.map((material) => ({
      ...material,
      current_yield_rate: Number(material.current_yield_rate) * 100 + '%',
    }));
  }, [data]);

  const materialOptions = useMemo(() => {
    if (!data) return [];
    return data.results.results.map((material) => ({
      value: material.id,
      label: material.name,
    }));
  }, [data]);

  return {
    materials,
    materialOptions,
    isLoading,
    isError: error,
    mutate,
  };
}
