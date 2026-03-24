import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { ReceivingTemplateDto } from '@/modules/procurement/dtos/receivingTemplate.dto';

export function useReceivingTemplate(procurementId?: number) {
  const key: SWRKey | null = procurementId
    ? {
        url: `/api/receiving/${procurementId}/template/`,
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ReceivingTemplateDto>>(key);

  const template = useMemo(() => {
    return data?.results;
  }, [data]);

  return {
    template,
    error,
    isLoading,
    mutate,
  };
}
