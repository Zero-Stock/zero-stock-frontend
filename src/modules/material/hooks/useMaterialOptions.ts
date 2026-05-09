import { useMemo } from 'react';
import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { MaterialOptionSchema } from '@/shared/types/schema';

export default function useMaterialOptions() {
  const key: SWRKey = {
    url: '/api/materials',
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<MaterialOptionSchema[]>>(key);

  const materialOptions = useMemo(() => {
    return (
      data?.result.map((material) => {
        return {
          label: material.name,
          value: material.id,
        };
      }) ?? []
    );
  }, [data]);

  return { materialOptions, error, isLoading, mutate };
}
