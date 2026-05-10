import { useMemo } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DishDetailSchema } from '@/shared/types/schema';

async function fetchDishDetail(
  dishId: number,
): Promise<DishDetailSchema | null> {
  try {
    const response = await apiClient.get<ApiResponseDto<DishDetailSchema>>(
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
): Promise<Map<number, DishDetailSchema>> {
  const uniqueIds = [...new Set(dishIds)];
  const results = new Map<number, DishDetailSchema>();

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
    Map<number, DishDetailSchema>
  >(key, () => fetchDishDetails(uniqueDishIds));

  return {
    dishDetails: data ?? new Map<number, DishDetailSchema>(),
    isLoading,
    isError: error,
    mutate,
  };
}
