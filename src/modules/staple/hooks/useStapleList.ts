import { useMemo } from 'react';
import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type {
  StapleListResponseSchema,
  StapleQuerySchema,
} from '@/shared/types/schema';

export function useStapleList(payload?: StapleQuerySchema) {
  const key: SWRKey = {
    url: '/api/staples/list',
    method: 'POST',
    options: {
      body: {
        page_size: 500,
        ...payload,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<StapleListResponseSchema>>(key);

  const staples = useMemo(() => data?.result.list ?? [], [data]);

  return {
    staples,
    isLoading,
    isError: error,
    mutate,
  };
}
