/**
 * Adapter functions to convert between backend Dish API types
 * and frontend form-friendly types.
 *
 * Backend: GET/POST/PUT /api/dishes/
 * - ingredients use raw_material (ID), processing (ID), net_quantity (kg)
 * Frontend form:
 * - ingredients use material (name), category, processing (name), quantity (grams)
 */
import type {
    Dish,
    DishIngredient,
    DishFormValues,
    DishFormIngredient,
    DishWritePayload,
} from './mockdata';

// ─── Backend → Frontend (for Edit Modal) ───

/**
 * Convert a backend Dish's ingredients into form-friendly values.
 * kg → grams, IDs → display names.
 */
export function dishToFormValues(dish: Dish): DishFormValues {
    return {
        name: dish.name,
        seasonings: dish.seasonings,
        cooking_method: dish.cooking_method,
        ingredients: dish.ingredients.map(ingredientToForm),
    };
}

export function ingredientToForm(ing: DishIngredient): DishFormIngredient {
    return {
        id: ing.id,
        raw_material_id: ing.raw_material,
        processing_id: ing.processing,
        material: ing.raw_material_name,
        category: '鲜品', // TODO: look up from material API
        processing: ing.processing_name ?? '',
        quantity: Math.round(parseFloat(ing.net_quantity) * 1000), // kg → g
    };
}

// ─── Frontend → Backend (for Save/Create) ───

/**
 * Convert form values into backend Dish shape (for local state update).
 * grams → kg.
 */
export function formValuesToDish(
    formValues: DishFormValues & { id: number },
): Dish {
    return {
        id: formValues.id,
        name: formValues.name,
        seasonings: formValues.seasonings,
        cooking_method: formValues.cooking_method,
        ingredients: (formValues.ingredients || []).map((ing, idx) => ({
            id: ing.id ?? Date.now() + idx,
            raw_material: 0, // Resolved by backend
            raw_material_name: ing.material,
            processing: null, // Resolved by backend
            processing_name: ing.processing,
            yield_rate: 1.0,
            net_quantity: (ing.quantity / 1000).toFixed(3), // g → kg
        })),
    };
}

/**
 * Convert form values into the POST/PUT /api/dishes/ write payload.
 * This is what you'd send to the backend.
 */
export function formValuesToWritePayload(
    formValues: DishFormValues,
): DishWritePayload {
    return {
        name: formValues.name,
        seasonings: formValues.seasonings,
        cooking_method: formValues.cooking_method,
        ingredients_write: (formValues.ingredients || []).map((ing) => ({
            raw_material: ing.raw_material_id ?? 0,
            processing: ing.processing_id ?? null,
            net_quantity: (ing.quantity / 1000).toFixed(3), // g → kg
        })),
    };
}

// ─── Display helpers ───

/**
 * Format a single ingredient for table display.
 * e.g. "去皮前膀 (去皮) 50g"
 */
export function formatIngredient(ing: DishIngredient): string {
    const grams = Math.round(parseFloat(ing.net_quantity) * 1000);
    const processingName = (ing.processing_name ?? '').trim();

    if (
        !processingName ||
        processingName.toLowerCase() === 'null' ||
        processingName === '无'
    ) {
        return `${ing.raw_material_name} ${grams}g`;
    }

    return `${ing.raw_material_name} (${processingName}) ${grams}g`;
}

/**
 * Format all ingredients of a dish for table display.
 * Returns newline-separated string.
 */
export function formatIngredients(ingredients: DishIngredient[]): string {
    return ingredients.map(formatIngredient).join('\n');
}
