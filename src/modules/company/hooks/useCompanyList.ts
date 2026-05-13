import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  CompanyListResponseSchema,
  CompanyQuerySchema,
} from '@/shared/types/schema';

export function useCompanyList(payload?: CompanyQuerySchema) {
  const key: SWRKey = {
    url: '/api/companies/list',
    method: 'POST',
    options: {
      body: payload ?? {},
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<CompanyListResponseSchema>>(key);

  return {
    companies: data?.result.list ?? [],
    total: data?.result?.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
