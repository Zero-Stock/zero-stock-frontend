import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { ProcurementSheetItemDto } from '@/modules/procurement/dtos/procurementSheetItem.dto';

export function useProcurementSheet(procurementId?: number) {
  const key: SWRKey | null = procurementId
    ? {
        url: `/api/procurement/${procurementId}/sheet/`,
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ProcurementSheetItemDto[]>>(key);

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
