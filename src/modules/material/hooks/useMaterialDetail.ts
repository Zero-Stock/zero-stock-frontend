import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { MaterialPreviewSchema } from '@/shared/types/schema';

export function useMaterialDetail(id?: number) {
  const key: SWRKey | null = id ? { url: `/api/materials/${id}` } : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<MaterialPreviewSchema>>(key);

  return {
    material: data?.result,
    error,
    isLoading,
    mutate,
  };
}
