import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { ReceivingTemplateSchema } from '@/shared/types/schema';

export function useReceivingTemplate(purchaseId?: number) {
  const key: SWRKey | null = purchaseId
    ? {
        url: `/api/receiving/${purchaseId}/template`,
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
