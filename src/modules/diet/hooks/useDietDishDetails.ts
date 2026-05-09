import { useMemo } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DishPreviewSchema } from '@/shared/types/schema';

async function fetchDishDetail(
  dishId: number,
): Promise<DishPreviewSchema | null> {
  try {
    const response = await apiClient.get<ApiResponseDto<DishPreviewSchema>>(
      `/api/dishes/${dishId}`,
    );
    return response.result;
  } catch {
    console.warn(`Failed to fetch dish ${dishId}`);
    return null;
  }
}

async function fetchDishDetails(
  dishIds: number[],
): Promise<Map<number, DishPreviewSchema>> {
  const uniqueIds = [...new Set(dishIds)];
  const results = new Map<number, DishPreviewSchema>();

  const fetches = uniqueIds.map(async (id) => {
    const detail = await fetchDishDetail(id);
    if (detail) {
      results.set(id, detail);
    }
  });

  await Promise.all(fetches);
  return results;
}

export function useDietDishDetails(dishIds: number[]) {
  const uniqueDishIds = useMemo(
    () => [...new Set(dishIds)].sort((a, b) => a - b),
    [dishIds],
  );

  const key =
    uniqueDishIds.length > 0
      ? ['diet-dish-details', uniqueDishIds.join(',')]
      : null;

  const { data, error, isLoading, mutate } = useSWR<
    Map<number, DishPreviewSchema>
  >(key, () => fetchDishDetails(uniqueDishIds));

  return {
    dishDetails: data ?? new Map<number, DishPreviewSchema>(),
    isLoading,
    isError: error,
    mutate,
  };
}
