// Re-export all types from DTOs for backwards compatibility
export type { DietCategory } from './dtos/diet.dto';
export type { WeeklyMenuRow, WeeklyMenuBatchItem, WeeklyMenuDishDetail, WeeklyMenuBatchDish } from './dtos/menu.dto';
export type { DishItem, DishDetail, DishIngredient, DayPlan, WeeklyPlan } from './dtos/meal-plan.dto';
export { MEAL_TIME_MAP } from './dtos/meal-plan.dto';

import type { DietCategory } from './dtos/diet.dto';
import type { WeeklyMenuRow } from './dtos/menu.dto';

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
    { id: 1, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 1, day_display: 'Monday', meal_time: 'B', meal_display: 'Breakfast', dishes: [3], dish_names: ['清炒小白菜'], dishes_detail: [{ dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    { id: 2, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 1, day_display: 'Monday', meal_time: 'L', meal_display: 'Lunch', dishes: [1], dish_names: ['西红柿打卤面'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }] },
    { id: 3, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 1, day_display: 'Monday', meal_time: 'D', meal_display: 'Dinner', dishes: [2, 3], dish_names: ['木须肉片', '清炒小白菜'], dishes_detail: [{ dish_id: 2, dish_name: '木须肉片', quantity: 1 }, { dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    // ── 周二 ──
    { id: 4, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 2, day_display: 'Tuesday', meal_time: 'B', meal_display: 'Breakfast', dishes: [1], dish_names: ['西红柿打卤面'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }] },
    { id: 5, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 2, day_display: 'Tuesday', meal_time: 'L', meal_display: 'Lunch', dishes: [2, 3], dish_names: ['木须肉片', '清炒小白菜'], dishes_detail: [{ dish_id: 2, dish_name: '木须肉片', quantity: 1 }, { dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    { id: 6, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 2, day_display: 'Tuesday', meal_time: 'D', meal_display: 'Dinner', dishes: [1, 2], dish_names: ['西红柿打卤面', '木须肉片'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }, { dish_id: 2, dish_name: '木须肉片', quantity: 1 }] },
    // ── 周三 ──
    { id: 7, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 3, day_display: 'Wednesday', meal_time: 'B', meal_display: 'Breakfast', dishes: [3], dish_names: ['清炒小白菜'], dishes_detail: [{ dish_id: 3, dish_name: '清炒小白菜', quantity: 2 }] },
    { id: 8, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 3, day_display: 'Wednesday', meal_time: 'L', meal_display: 'Lunch', dishes: [1, 2], dish_names: ['西红柿打卤面', '木须肉片'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }, { dish_id: 2, dish_name: '木须肉片', quantity: 1 }] },
    { id: 9, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 3, day_display: 'Wednesday', meal_time: 'D', meal_display: 'Dinner', dishes: [2], dish_names: ['木须肉片'], dishes_detail: [{ dish_id: 2, dish_name: '木须肉片', quantity: 1 }] },
    // ── 周四 ──
    { id: 10, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 4, day_display: 'Thursday', meal_time: 'B', meal_display: 'Breakfast', dishes: [1, 3], dish_names: ['西红柿打卤面', '清炒小白菜'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }, { dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    { id: 11, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 4, day_display: 'Thursday', meal_time: 'L', meal_display: 'Lunch', dishes: [2], dish_names: ['木须肉片'], dishes_detail: [{ dish_id: 2, dish_name: '木须肉片', quantity: 1 }] },
    { id: 12, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 4, day_display: 'Thursday', meal_time: 'D', meal_display: 'Dinner', dishes: [1, 2, 3], dish_names: ['西红柿打卤面', '木须肉片', '清炒小白菜'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }, { dish_id: 2, dish_name: '木须肉片', quantity: 1 }, { dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    // ── 周五 ──
    { id: 13, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 5, day_display: 'Friday', meal_time: 'B', meal_display: 'Breakfast', dishes: [3], dish_names: ['清炒小白菜'], dishes_detail: [{ dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    { id: 14, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 5, day_display: 'Friday', meal_time: 'L', meal_display: 'Lunch', dishes: [1, 3], dish_names: ['西红柿打卤面', '清炒小白菜'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }, { dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    { id: 15, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 5, day_display: 'Friday', meal_time: 'D', meal_display: 'Dinner', dishes: [2, 1], dish_names: ['木须肉片', '西红柿打卤面'], dishes_detail: [{ dish_id: 2, dish_name: '木须肉片', quantity: 1 }, { dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }] },
    // ── 周六 ──
    { id: 16, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 6, day_display: 'Saturday', meal_time: 'B', meal_display: 'Breakfast', dishes: [1], dish_names: ['西红柿打卤面'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }] },
    { id: 17, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 6, day_display: 'Saturday', meal_time: 'L', meal_display: 'Lunch', dishes: [2, 3], dish_names: ['木须肉片', '清炒小白菜'], dishes_detail: [{ dish_id: 2, dish_name: '木须肉片', quantity: 1 }, { dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    { id: 18, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 6, day_display: 'Saturday', meal_time: 'D', meal_display: 'Dinner', dishes: [3, 2], dish_names: ['清炒小白菜', '木须肉片'], dishes_detail: [{ dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }, { dish_id: 2, dish_name: '木须肉片', quantity: 1 }] },
    // ── 周日 ──
    { id: 19, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 7, day_display: 'Sunday', meal_time: 'B', meal_display: 'Breakfast', dishes: [2], dish_names: ['木须肉片'], dishes_detail: [{ dish_id: 2, dish_name: '木须肉片', quantity: 1 }] },
    { id: 20, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 7, day_display: 'Sunday', meal_time: 'L', meal_display: 'Lunch', dishes: [1, 2, 3], dish_names: ['西红柿打卤面', '木须肉片', '清炒小白菜'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }, { dish_id: 2, dish_name: '木须肉片', quantity: 1 }, { dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
    { id: 21, company: 1, company_name: 'XX医院', diet_category: 1, diet_category_name: '普食一', day_of_week: 7, day_display: 'Sunday', meal_time: 'D', meal_display: 'Dinner', dishes: [1, 3], dish_names: ['西红柿打卤面', '清炒小白菜'], dishes_detail: [{ dish_id: 1, dish_name: '西红柿打卤面', quantity: 1 }, { dish_id: 3, dish_name: '清炒小白菜', quantity: 1 }] },
];
