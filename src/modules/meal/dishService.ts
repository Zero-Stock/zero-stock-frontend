/**
 * Service to fetch dish details from the Dish module's API.
 * In the Meal module, this is used READ-ONLY to display ingredients.
 *
 * Real usage: GET /api/dishes/{id}/
 * Returns: DishDetail (with ingredients array)
 */
import type { DishDetail } from './mockdata';

// ─── Mock dish details (simulating GET /api/dishes/{id}/) ───
const mockDishDetails: Record<number, DishDetail> = {
    1: {
        id: 1, name: '紫薯包一个', seasonings: '', cooking_method: '蒸制',
        ingredients: [
            { id: 1, raw_material: 1, raw_material_name: '面粉', processing: null, processing_name: '无', yield_rate: 1.0, net_quantity: '0.050' },
            { id: 2, raw_material: 2, raw_material_name: '紫薯', processing: 1, processing_name: '去皮蒸熟', yield_rate: 0.85, net_quantity: '0.030' },
        ],
    },
    6: {
        id: 6, name: '西红柿打卤面', seasonings: '盐2g, 糖1g', cooking_method: '煮制',
        ingredients: [
            { id: 3, raw_material: 3, raw_material_name: '去皮前膀', processing: 1, processing_name: '去皮', yield_rate: 0.90, net_quantity: '0.050' },
            { id: 4, raw_material: 4, raw_material_name: '西红柿', processing: null, processing_name: '洗净', yield_rate: 0.95, net_quantity: '0.080' },
            { id: 5, raw_material: 5, raw_material_name: '干香菇', processing: 2, processing_name: '泡发', yield_rate: 0.80, net_quantity: '0.010' },
            { id: 6, raw_material: 6, raw_material_name: '面条', processing: null, processing_name: '无', yield_rate: 1.0, net_quantity: '0.150' },
        ],
    },
    7: {
        id: 7, name: '木须菜花', seasonings: '盐2g, 生抽5g', cooking_method: '炒制',
        ingredients: [
            { id: 7, raw_material: 7, raw_material_name: '菜花', processing: 1, processing_name: '切块', yield_rate: 0.85, net_quantity: '0.100' },
            { id: 8, raw_material: 8, raw_material_name: '猪瘦肉', processing: 2, processing_name: '切片', yield_rate: 0.95, net_quantity: '0.050' },
            { id: 9, raw_material: 9, raw_material_name: '木耳', processing: 3, processing_name: '泡发', yield_rate: 0.80, net_quantity: '0.010' },
        ],
    },
};

/**
 * Fetch dish detail by ID.
 * In production: GET /api/dishes/{id}/
 * Currently uses mock data.
 */
export async function fetchDishDetail(dishId: number): Promise<DishDetail | null> {
    // TODO: Replace with real API call:
    // return authedApiClient.get<DishDetail>(`/api/dishes/${dishId}/`);
    return mockDishDetails[dishId] ?? null;
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

    // TODO: Replace with batch API call or parallel fetches
    for (const id of uniqueIds) {
        const detail = await fetchDishDetail(id);
        if (detail) {
            results.set(id, detail);
        }
    }

    return results;
}
