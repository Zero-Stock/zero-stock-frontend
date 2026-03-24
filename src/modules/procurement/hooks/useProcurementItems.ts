import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { ProcurementItemDto } from '../dtos/procurementItem.dto';

export function useProcurementItems(procurementId?: number) {
  const key: SWRKey | null = procurementId
    ? {
        url: `/api/procurement/${procurementId}/items/`,
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ProcurementItemDto[]>>(key);

  const items = useMemo(() => {
    return data?.results ?? [];
  }, [data]);

  return {
    items,
    error,
    isLoading,
    mutate,
  };
}
