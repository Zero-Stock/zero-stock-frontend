import useSWR from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierMaterialDto } from '../dtos/supplierMaterial.dto';
import type { ApiListResponseDto } from '@/shared/dtos/apiResponse.dto';

export interface SupplierMaterialListPayload {
  supplier?: number;
  raw_material?: number;
  search?: string;
  ordering?: string;
}

export function useSupplierMaterials(payload?: SupplierMaterialListPayload) {
  const { data, error, isLoading, mutate } = useSWR<
    ApiListResponseDto<SupplierMaterialDto[]>
  >(
    payload ? ['/api/supplier-materials/', payload] : null,
    async ([url, params]: [string, SupplierMaterialListPayload]) => {
      const p = new URLSearchParams();
      if (params.supplier) p.set('supplier', params.supplier.toString());
      if (params.raw_material)
        p.set('raw_material', params.raw_material.toString());
      if (params.search?.trim()) p.set('search', params.search.trim());
      if (params.ordering) p.set('ordering', params.ordering);

      const s = p.toString();
      const finalUrl = s ? `${url}?${s}` : url;
      return apiClient.get<ApiListResponseDto<SupplierMaterialDto[]>>(
        finalUrl as `/${string}`,
      );
    },
  );

  return {
    materials: data?.results.results ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
