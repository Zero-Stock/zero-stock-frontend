// ─── Backend API types (matching API_USAGE.md §9-14) ───

/** DRF paginated response wrapper */
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

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

// ─── Frontend form types ───
// The edit form works with friendlier field names for display,
// then we convert to DishWritePayload before sending to API.

export interface DishFormIngredient {
    id?: number;
    raw_material_id?: number;  // backend ID, carried through for writes
    processing_id?: number | null;
    material: string;        // raw_material_name (display)
    category: string;        // material category name
    processing: string;      // processing_name (display)
    quantity: number;         // grams (UI shows grams, API uses kg)
}

export interface DishFormValues {
    name: string;
    ingredients: DishFormIngredient[];
    seasonings: string;
    cooking_method: string;
}

// ─── Mock data ───

export const mockDishes: Dish[] = [
    {
        id: 1,
        name: '西红柿打卤面',
        seasonings: '盐2g, 糖1g',
        cooking_method: '1. 去皮前膀加盐煎至两面金黄\n2. 炒西红柿\n3. 加水煮1分钟\n4. 水开后下入面煮2分钟',
        ingredients: [
            { id: 101, raw_material: 1, raw_material_name: '去皮前膀', processing: 1, processing_name: '去皮', yield_rate: 0.90, net_quantity: '0.050' },
            { id: 102, raw_material: 2, raw_material_name: '西红柿', processing: null, processing_name: '洗净备用', yield_rate: 0.95, net_quantity: '0.080' },
            { id: 103, raw_material: 3, raw_material_name: '干香菇', processing: 2, processing_name: '泡发', yield_rate: 0.80, net_quantity: '0.010' },
        ],
    },
    {
        id: 2,
        name: '木须肉片',
        seasonings: '盐2g, 生抽5g, 料酒5g',
        cooking_method: '1. 鸡蛋炒熟盛出\n2. 肉片炒变色\n3. 加入木耳黄瓜翻炒\n4. 加入鸡蛋和调料炒匀',
        ingredients: [
            { id: 201, raw_material: 4, raw_material_name: '猪瘦肉', processing: 3, processing_name: '切片', yield_rate: 0.95, net_quantity: '0.100' },
            { id: 202, raw_material: 5, raw_material_name: '木耳', processing: 2, processing_name: '泡发', yield_rate: 0.80, net_quantity: '0.010' },
            { id: 203, raw_material: 6, raw_material_name: '黄瓜', processing: 3, processing_name: '切片', yield_rate: 0.90, net_quantity: '0.050' },
            { id: 204, raw_material: 7, raw_material_name: '鸡蛋', processing: null, processing_name: '打散', yield_rate: 1.0, net_quantity: '0.050' },
        ],
    },
    {
        id: 3,
        name: '清炒小白菜',
        seasonings: '盐2g, 香油1g',
        cooking_method: '1. 热锅冷油爆香蒜末\n2. 下小白菜大火快炒\n3. 加盐调味出锅',
        ingredients: [
            { id: 301, raw_material: 8, raw_material_name: '小白菜', processing: null, processing_name: '洗净切段', yield_rate: 0.85, net_quantity: '0.200' },
            { id: 302, raw_material: 9, raw_material_name: '蒜', processing: null, processing_name: '切末', yield_rate: 0.90, net_quantity: '0.010' },
        ],
    },
];
