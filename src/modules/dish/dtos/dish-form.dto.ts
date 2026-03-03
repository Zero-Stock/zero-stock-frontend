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
