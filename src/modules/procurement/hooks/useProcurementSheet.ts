import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { ProcurementSheetDto } from '@/modules/procurement/dtos/procurementSheetItem.dto';

export function useProcurementSheet(procurementId?: number) {
  const key: SWRKey | null = procurementId
    ? {
        url: `/api/procurement/${procurementId}/sheet/`,
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ProcurementSheetDto>>(key);

  const sheet = useMemo(() => {
    return data?.result;
  }, [data]);

  const items = useMemo(() => {
    return data?.result?.items ?? [];
  }, [data]);

  return {
    sheet,
    items,
    error,
    isLoading,
    mutate,
  };
}
