/**
 * Service to fetch dish details from the Dish API.
 * Used by the Meal module READ-ONLY to display ingredients.
 *
 * GET /api/dishes/{id}/
 */
import { apiClient } from '@/shared/api/apiClient.client';
import type { DishDetail } from './mockdata';

/**
 * Fetch dish detail by ID.
 * GET /api/dishes/{id}/
 */
export async function fetchDishDetail(
    dishId: number,
): Promise<DishDetail | null> {
    try {
        return await apiClient.get<DishDetail>(`/api/dishes/${dishId}/`);
    } catch {
        console.warn(`Failed to fetch dish ${dishId}`);
        return null;
    }
}

/**
 * Fetch multiple dish details at once.
 * Deduplicates IDs and returns a map of id → DishDetail.
 */
export async function fetchDishDetails(
    dishIds: number[],
): Promise<Map<number, DishDetail>> {
    const uniqueIds = [...new Set(dishIds)];
    const results = new Map<number, DishDetail>();

    // Parallel fetch for speed
    const fetches = uniqueIds.map(async (id) => {
        const detail = await fetchDishDetail(id);
        if (detail) {
            results.set(id, detail);
        }
    });

    await Promise.all(fetches);
    return results;
}
