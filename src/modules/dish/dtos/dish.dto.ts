// ─── Backend API types (matching API_USAGE.md §9-14) ───

/** Ingredient in GET /api/dishes/{id}/ response (read-only) */
export interface DishIngredient {
    id: number;
    raw_material: number;           // RawMaterial ID
    raw_material_name: string;      // e.g. "牛肉"
    processing: number | null;      // ProcessedMaterial ID (nullable)
    processing_name: string;        // e.g. "切块"
    yield_rate: number;             // e.g. 0.95
    net_quantity: string;           // kg, e.g. "0.150"
}

/** Ingredient for POST/PUT /api/dishes/ (write-only) */
export interface DishIngredientWrite {
    raw_material: number;
    processing: number | null;
    net_quantity: string;            // kg
}

/** Full dish from GET /api/dishes/ or GET /api/dishes/{id}/ */
export interface Dish {
    id: number;
    name: string;
    seasonings: string;             // 调料
    cooking_method: string;         // 制作工艺
    ingredients: DishIngredient[];   // read-only ingredient list
}

/** Payload for POST/PUT /api/dishes/ */
export interface DishWritePayload {
    name: string;
    seasonings: string;
    cooking_method: string;
    ingredients_write: DishIngredientWrite[];
}
