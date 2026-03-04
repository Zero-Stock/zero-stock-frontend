import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiListResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { SupplierPreviewDto } from '../dtos/supplierPreview.dto';

export interface SupplierListPayload {
  search?: string;
}

export function useSupplierList(payload?: SupplierListPayload) {
  const qs = useMemo(() => {
    const p = new URLSearchParams();
    const search = payload?.search?.trim();

    if (search) p.set('search', search);
    const s = p.toString();

    return s ? `?${s}` : '';
  }, [payload?.search]);

  const key: SWRKey = {
    url: `/api/suppliers/${qs}`,
    method: 'GET',
    options: {},
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiListResponseDto<SupplierPreviewDto[]>>(key);

  return {
    suppliers: data?.results.results ?? [],
    total: data?.results?.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
