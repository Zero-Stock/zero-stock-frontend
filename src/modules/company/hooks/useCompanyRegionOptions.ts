import { useMemo } from 'react';
import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { CompanyRegionOptionSchema } from '@/shared/types/schema';
import type { Query } from '@/shared/api/apiClient';

export default function useCompanyRegionOptions(
  companyId?: number,
  query?: Query,
) {
  const key: SWRKey | null = companyId
    ? {
        url: `/api/companies/${companyId}/regions`,
        options: {
          query,
        },
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<CompanyRegionOptionSchema[]>>(key);

  const regions = useMemo(() => {
    return data?.result ?? [];
  }, [data]);

  const regionOptions = useMemo(() => {
    return regions.map((region) => ({
      label: region.name,
      value: region.id,
    }));
  }, [regions]);

  return { regions, regionOptions, error, isLoading, mutate };
}
