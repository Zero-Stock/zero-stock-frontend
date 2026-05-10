import { useMemo } from 'react';
import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { StapleOptionSchema } from '@/shared/types/schema';

export default function useStapleOptions() {
  const key: SWRKey = {
    url: '/api/staples',
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<StapleOptionSchema[]>>(key);

  const stapleOptions = useMemo(() => {
    return (
      data?.result.map((staple) => ({
        label: staple.name,
        value: staple.id,
      })) ?? []
    );
  }, [data]);

  return { stapleOptions, error, isLoading, mutate };
}
