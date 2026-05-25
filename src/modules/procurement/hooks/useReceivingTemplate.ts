import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { ReceivingTemplateSchema } from '@/shared/types/schema';

export function useReceivingTemplate(procurementId?: number) {
  const key: SWRKey | null = procurementId
    ? {
        url: `/api/receiving/${procurementId}/template`,
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ReceivingTemplateSchema>>(key);

  const template = useMemo(() => {
    return data?.result;
  }, [data]);

  return {
    template,
    error,
    isLoading,
    mutate,
  };
}
