import type {
  Dish,
  DishFormIngredient,
  DishFormValues,
  DishIngredient,
  DishWritePayload,
} from '../mockdata';
import type { RawMaterialDto } from '../dtos/rawMaterial.dto';

export function dishToFormValues(
  dish: Dish,
  materials: RawMaterialDto[] = [],
): DishFormValues {
  return {
    name: dish.name,
    seasonings: dish.seasonings,
    cooking_method: dish.cooking_method,
    ingredients: dish.ingredients.map((ingredient) =>
      ingredientToForm(ingredient, materials),
    ),
  };
}

export function ingredientToForm(
  ingredient: DishIngredient,
  materials: RawMaterialDto[] = [],
): DishFormIngredient {
  const material = materials.find((item) => item.id === ingredient.raw_material);

  return {
    id: ingredient.id,
    raw_material_id: ingredient.raw_material,
    processing_id: ingredient.processing,
    material: ingredient.raw_material_name,
    category: material?.category_name ?? '',
    processing: ingredient.processing_name ?? '',
    quantity: Math.round(parseFloat(ingredient.net_quantity) * 1000),
  };
}

export function formValuesToWritePayload(
  formValues: DishFormValues,
): DishWritePayload {
  return {
    name: formValues.name,
    seasonings: formValues.seasonings,
    cooking_method: formValues.cooking_method,
    ingredients_write: (formValues.ingredients || []).map((ingredient) => ({
      raw_material: ingredient.raw_material_id ?? 0,
      processing: ingredient.processing_id ?? null,
      net_quantity: (ingredient.quantity / 1000).toFixed(3),
    })),
  };
}

export function formatIngredient(ingredient: DishIngredient): string {
  const grams = Math.round(parseFloat(ingredient.net_quantity) * 1000);
  const processingName = (ingredient.processing_name ?? '').trim();

  if (
    !processingName ||
    processingName.toLowerCase() === 'null' ||
    processingName === '无'
  ) {
    return `${ingredient.raw_material_name} ${grams}g`;
  }

  return `${ingredient.raw_material_name} (${processingName}) ${grams}g`;
}

export function formatIngredients(ingredients: DishIngredient[]): string {
  return ingredients.map(formatIngredient).join('\n');
}
