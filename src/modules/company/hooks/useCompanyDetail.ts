import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { CompanyDetailSchema } from '@/shared/types/schema';

export function useCompanyDetail(companyId?: number) {
  const key: SWRKey | null = companyId
    ? {
        url: `/api/companies/${companyId}`,
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<CompanyDetailSchema>>(key);

  return {
    company: data?.result,
    isLoading,
    isError: error,
    mutate,
  };
}
