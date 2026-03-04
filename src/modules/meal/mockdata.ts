// ─── Backend API types (matching API_USAGE.md) ───

/** GET /api/diets/ response item */
export interface DietCategory {
    id: number;
    name: string;
}

/** A single dish in the weekly menu (from dish_names / dishes array) */
export interface DishItem {
    id: number;       // dish ID from backend
    name: string;     // dish name (from dish_names)
    count?: number;   // servings – displayed as x1, x2...
}

// Re-export dish types from the dish module (single source of truth)
export type { DishIngredient, Dish as DishDetail } from '@/modules/dish/mockdata';

/**
 * A single row from GET /api/weekly-menus/ response.
 * Each row = one (company, diet_category, day_of_week, meal_time) slot.
 */
export interface WeeklyMenuRow {
    id: number;
    company: number;
    company_name: string;
    diet_category: number;
    diet_category_name: string;
    day_of_week: number;      // 1=Monday ... 7=Sunday
    day_display: string;      // "Monday", "Tuesday", ...
    meal_time: 'B' | 'L' | 'D';  // Breakfast, Lunch, Dinner
    meal_display: string;     // "Breakfast", "Lunch", "Dinner"
    dishes: number[];         // dish IDs
    dish_names: string[];     // dish names (parallel array)
}

/** POST /api/weekly-menus/batch/ request item */
export interface WeeklyMenuBatchItem {
    company: number;
    diet_category: number;
    day_of_week: number;
    meal_time: 'B' | 'L' | 'D';
    dishes: number[];
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

export const DAY_LABELS: Record<number, string> = {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日',
};

export const MEAL_TIME_MAP: Record<string, 'B' | 'L' | 'D'> = {
    breakfast: 'B',
    lunch: 'L',
    dinner: 'D',
};

// ─── Mock data ───

export const mockDietCategories: DietCategory[] = [
    { id: 1, name: '普食一' },
    { id: 2, name: '普食二' },
    { id: 3, name: '糖尿' },
    { id: 4, name: '软食' },
    { id: 5, name: '素食' },
    { id: 6, name: '低嘌呤' },
];

/** Mock data simulating GET /api/weekly-menus/?diet_category=1 response
 *  Dish IDs match the dish module's mockDishes (1=西红柿打卤面, 2=木须肉片, 3=清炒小白菜)
 */
export const mockWeeklyMenuRows: WeeklyMenuRow[] = [
    // ── 周一 ──
    { id: 1, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 1, day_display: 'Monday', meal_time: 'B', meal_display: 'Breakfast', dishes: [3], dish_names: ['清炒小白菜'] },
    { id: 2, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 1, day_display: 'Monday', meal_time: 'L', meal_display: 'Lunch', dishes: [1], dish_names: ['西红柿打卤面'] },
    { id: 3, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 1, day_display: 'Monday', meal_time: 'D', meal_display: 'Dinner', dishes: [2, 3], dish_names: ['木须肉片', '清炒小白菜'] },
    // ── 周二 ──
    { id: 4, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 2, day_display: 'Tuesday', meal_time: 'B', meal_display: 'Breakfast', dishes: [1], dish_names: ['西红柿打卤面'] },
    { id: 5, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 2, day_display: 'Tuesday', meal_time: 'L', meal_display: 'Lunch', dishes: [2, 3], dish_names: ['木须肉片', '清炒小白菜'] },
    { id: 6, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 2, day_display: 'Tuesday', meal_time: 'D', meal_display: 'Dinner', dishes: [1, 2], dish_names: ['西红柿打卤面', '木须肉片'] },
    // ── 周三 ──
    { id: 7, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 3, day_display: 'Wednesday', meal_time: 'B', meal_display: 'Breakfast', dishes: [3, 3], dish_names: ['清炒小白菜', '清炒小白菜'] },
    { id: 8, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 3, day_display: 'Wednesday', meal_time: 'L', meal_display: 'Lunch', dishes: [1, 2], dish_names: ['西红柿打卤面', '木须肉片'] },
    { id: 9, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 3, day_display: 'Wednesday', meal_time: 'D', meal_display: 'Dinner', dishes: [2], dish_names: ['木须肉片'] },
    // ── 周四 ──
    { id: 10, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 4, day_display: 'Thursday', meal_time: 'B', meal_display: 'Breakfast', dishes: [1, 3], dish_names: ['西红柿打卤面', '清炒小白菜'] },
    { id: 11, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 4, day_display: 'Thursday', meal_time: 'L', meal_display: 'Lunch', dishes: [2], dish_names: ['木须肉片'] },
    { id: 12, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 4, day_display: 'Thursday', meal_time: 'D', meal_display: 'Dinner', dishes: [1, 2, 3], dish_names: ['西红柿打卤面', '木须肉片', '清炒小白菜'] },
    // ── 周五 ──
    { id: 13, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 5, day_display: 'Friday', meal_time: 'B', meal_display: 'Breakfast', dishes: [3], dish_names: ['清炒小白菜'] },
    { id: 14, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 5, day_display: 'Friday', meal_time: 'L', meal_display: 'Lunch', dishes: [1, 3], dish_names: ['西红柿打卤面', '清炒小白菜'] },
    { id: 15, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 5, day_display: 'Friday', meal_time: 'D', meal_display: 'Dinner', dishes: [2, 1], dish_names: ['木须肉片', '西红柿打卤面'] },
    // ── 周六 ──
    { id: 16, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 6, day_display: 'Saturday', meal_time: 'B', meal_display: 'Breakfast', dishes: [1], dish_names: ['西红柿打卤面'] },
    { id: 17, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 6, day_display: 'Saturday', meal_time: 'L', meal_display: 'Lunch', dishes: [2, 3], dish_names: ['木须肉片', '清炒小白菜'] },
    { id: 18, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 6, day_display: 'Saturday', meal_time: 'D', meal_display: 'Dinner', dishes: [3, 2], dish_names: ['清炒小白菜', '木须肉片'] },
    // ── 周日 ──
    { id: 19, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 7, day_display: 'Sunday', meal_time: 'B', meal_display: 'Breakfast', dishes: [2], dish_names: ['木须肉片'] },
    { id: 20, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 7, day_display: 'Sunday', meal_time: 'L', meal_display: 'Lunch', dishes: [1, 2, 3], dish_names: ['西红柿打卤面', '木须肉片', '清炒小白菜'] },
    { id: 21, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 7, day_display: 'Sunday', meal_time: 'D', meal_display: 'Dinner', dishes: [1, 3], dish_names: ['西红柿打卤面', '清炒小白菜'] },
];
