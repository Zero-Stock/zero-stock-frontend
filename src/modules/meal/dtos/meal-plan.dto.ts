// Re-export dish types from the dish module (single source of truth)
export type { DishIngredient, Dish as DishDetail } from '@/modules/dish/dtos/dish.dto';

/** A single dish in the weekly menu (from dish_names / dishes array) */
export interface DishItem {
    id: number;       // dish ID from backend
    name: string;     // dish name (from dish_names)
    count?: number;   // servings – displayed as x1, x2...
}

// ─── Frontend UI types ───

export interface DayPlan {
    dayOfWeek: string;       // e.g. "周一"
    dayNumber: number;       // 1-7
    breakfast: DishItem[];
    lunch: DishItem[];
    dinner: DishItem[];
}

export interface WeeklyPlan {
    diet_category_id: number;
    days: DayPlan[];
}

// ─── Constants ───

export const MEAL_TIME_MAP: Record<string, 'B' | 'L' | 'D'> = {
    breakfast: 'B',
    lunch: 'L',
    dinner: 'D',
};
