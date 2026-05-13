import { useMemo } from 'react';
import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  CompanyOptionSchema,
  CompanyQuerySchema,
} from '@/shared/types/schema';

export default function useCompanyOptions(query?: CompanyQuerySchema) {
  const key: SWRKey = {
    url: '/api/companies',
    options: {
      query,
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<CompanyOptionSchema[]>>(key);

  const companies = useMemo(() => {
    return data?.result ?? [];
  }, [data]);

  const companyOptions = useMemo(() => {
    return companies.map((company) => ({
      label: company.name,
      value: company.id,
    }));
  }, [companies]);

  return { companies, companyOptions, error, isLoading, mutate };
}
