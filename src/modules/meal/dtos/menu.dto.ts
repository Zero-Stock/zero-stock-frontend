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
