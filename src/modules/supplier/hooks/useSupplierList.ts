import useSWR from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierPreviewDto } from '../dtos/supplierPreview.dto';

export interface SupplierListPayload {
  search?: string;
}

export function useSupplierList(payload?: SupplierListPayload) {
  const { data, error, isLoading, mutate } = useSWR<SupplierPreviewDto[]>(
    ['/api/suppliers/', payload ?? {}],
    async ([path, payload]) => {
      const qs = new URLSearchParams();
      if (payload?.search) qs.set('search', payload.search);

      const url = qs.toString() ? `${path}?${qs.toString()}` : path;

      const res = await apiClient.get<
        SupplierPreviewDto[] | { results: SupplierPreviewDto[] }
      >(url);

      // ✅ 兼容两种形状：数组 or {results:数组}
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as any).results))
        return (res as any).results;

      return [];
    },
  );

  return {
    suppliers: Array.isArray(data) ? data : [],
    isLoading,
    isError: error,
    mutate,
  };
}
