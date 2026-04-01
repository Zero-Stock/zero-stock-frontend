import { useMemo } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';
import type { DishDetail } from '../mockdata';

async function fetchDishDetail(dishId: number): Promise<DishDetail | null> {
  try {
    const response = await apiClient.get<{ results: DishDetail }>(
      `/api/dishes/${dishId}/`,
    );
    return response.results;
  } catch {
    console.warn(`Failed to fetch dish ${dishId}`);
    return null;
  }
}

async function fetchDishDetails(
  dishIds: number[],
): Promise<Map<number, DishDetail>> {
  const uniqueIds = [...new Set(dishIds)];
  const results = new Map<number, DishDetail>();

  const fetches = uniqueIds.map(async (id) => {
    const detail = await fetchDishDetail(id);
    if (detail) {
      results.set(id, detail);
    }
  });

  await Promise.all(fetches);
  return results;
}

export function useMealDishDetails(dishIds: number[]) {
  const uniqueDishIds = useMemo(
    () => [...new Set(dishIds)].sort((a, b) => a - b),
    [dishIds],
  );

  const key =
    uniqueDishIds.length > 0
      ? ['meal-dish-details', uniqueDishIds.join(',')]
      : null;

  const { data, error, isLoading, mutate } = useSWR<Map<number, DishDetail>>(
    key,
    () => fetchDishDetails(uniqueDishIds),
  );

  return {
    dishDetails: data ?? new Map<number, DishDetail>(),
    isLoading,
    isError: error,
    mutate,
  };
}
