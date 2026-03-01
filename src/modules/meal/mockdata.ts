// ─── Backend API types (matching API_USAGE.md) ───

/** GET /api/diets/ response item */
export interface DietCategory {
  id: number;
  name: string;
}

/** A single dish in the weekly menu (from dish_names / dishes array) */
export interface DishItem {
  id: number; // dish ID from backend
  name: string; // dish name (from dish_names)
  count?: number; // servings – displayed as x1, x2...
}

/** Ingredient from GET /api/dishes/{id}/ response */
export interface DishIngredient {
  id: number;
  raw_material: number;
  raw_material_name: string;
  processing: number | null;
  processing_name: string;
  yield_rate: number;
  net_quantity: string; // kg, e.g. "0.150"
}

/** Full dish detail from GET /api/dishes/{id}/ */
export interface DishDetail {
  id: number;
  name: string;
  seasonings: string;
  cooking_method: string;
  ingredients: DishIngredient[];
}

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
  day_of_week: number; // 1=Monday ... 7=Sunday
  day_display: string; // "Monday", "Tuesday", ...
  meal_time: 'B' | 'L' | 'D'; // Breakfast, Lunch, Dinner
  meal_display: string; // "Breakfast", "Lunch", "Dinner"
  dishes: number[]; // dish IDs
  dish_names: string[]; // dish names (parallel array)
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
  dayOfWeek: string; // e.g. "周一"
  dayNumber: number; // 1-7
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

/** Mock data simulating GET /api/weekly-menus/?diet_category=1 response */
export const mockWeeklyMenuRows: WeeklyMenuRow[] = [
  // ── 周一 ──
  {
    id: 1,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 1,
    day_display: 'Monday',
    meal_time: 'B',
    meal_display: 'Breakfast',
    dishes: [1, 2, 3, 4, 5],
    dish_names: ['紫薯包一个', '果子一根', '黑米粥', '鸡蛋', '炝萝卜丝'],
  },
  {
    id: 2,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 1,
    day_display: 'Monday',
    meal_time: 'L',
    meal_display: 'Lunch',
    dishes: [6],
    dish_names: ['西红柿打卤面'],
  },
  {
    id: 3,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 1,
    day_display: 'Monday',
    meal_time: 'D',
    meal_display: 'Dinner',
    dishes: [7, 8],
    dish_names: ['木须菜花', '虾皮小白菜'],
  },
  // ── 周二 ──
  {
    id: 4,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 2,
    day_display: 'Tuesday',
    meal_time: 'B',
    meal_display: 'Breakfast',
    dishes: [9, 10, 11, 12],
    dish_names: ['糖包两个', '牛奶', '咸菜', '煮鸡蛋'],
  },
  {
    id: 5,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 2,
    day_display: 'Tuesday',
    meal_time: 'L',
    meal_display: 'Lunch',
    dishes: [13, 14],
    dish_names: ['红烧带鱼', '白菜炖豆腐'],
  },
  {
    id: 6,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 2,
    day_display: 'Tuesday',
    meal_time: 'D',
    meal_display: 'Dinner',
    dishes: [15],
    dish_names: ['鸡蛋香干合菜'],
  },
  // ── 周三 ──
  {
    id: 7,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 3,
    day_display: 'Wednesday',
    meal_time: 'B',
    meal_display: 'Breakfast',
    dishes: [16, 17, 18, 19, 20],
    dish_names: ['馒头一个', '南瓜包一个', '豆浆', '拌白菜', '鸡蛋'],
  },
  {
    id: 8,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 3,
    day_display: 'Wednesday',
    meal_time: 'L',
    meal_display: 'Lunch',
    dishes: [21],
    dish_names: ['炒面'],
  },
  {
    id: 9,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 3,
    day_display: 'Wednesday',
    meal_time: 'D',
    meal_display: 'Dinner',
    dishes: [22, 23],
    dish_names: ['爆两样', '豉油娃娃菜'],
  },
  // ── 周四 ──
  {
    id: 10,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 4,
    day_display: 'Thursday',
    meal_time: 'B',
    meal_display: 'Breakfast',
    dishes: [24, 25, 26, 27],
    dish_names: ['火腿鸡蛋卷2个', '咸菜', '南瓜粥', '鸡蛋'],
  },
  {
    id: 11,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 4,
    day_display: 'Thursday',
    meal_time: 'L',
    meal_display: 'Lunch',
    dishes: [28, 29],
    dish_names: ['鸡蛋炒芹菜', '麻婆豆腐'],
  },
  {
    id: 12,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 4,
    day_display: 'Thursday',
    meal_time: 'D',
    meal_display: 'Dinner',
    dishes: [30, 31],
    dish_names: ['鱼香肉丝', '香菇油菜'],
  },
  // ── 周五 ──
  {
    id: 13,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 5,
    day_display: 'Friday',
    meal_time: 'B',
    meal_display: 'Breakfast',
    dishes: [32, 33, 34, 35],
    dish_names: ['肉包一个', '小米粥', '酱菜', '红豆糕'],
  },
  {
    id: 14,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 5,
    day_display: 'Friday',
    meal_time: 'L',
    meal_display: 'Lunch',
    dishes: [36, 37],
    dish_names: ['宫保鸡丁', '清炒西兰花'],
  },
  {
    id: 15,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 5,
    day_display: 'Friday',
    meal_time: 'D',
    meal_display: 'Dinner',
    dishes: [38, 39],
    dish_names: ['京酱肉丝', '西红柿炒鸡蛋'],
  },
  // ── 周六 ──
  {
    id: 16,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 6,
    day_display: 'Saturday',
    meal_time: 'B',
    meal_display: 'Breakfast',
    dishes: [40, 41, 42],
    dish_names: ['菜包两个', '豆脑一碗', '油饼半张'],
  },
  {
    id: 17,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 6,
    day_display: 'Saturday',
    meal_time: 'L',
    meal_display: 'Lunch',
    dishes: [43, 44],
    dish_names: ['红烧肉', '蒜蓉油麦菜'],
  },
  {
    id: 18,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 6,
    day_display: 'Saturday',
    meal_time: 'D',
    meal_display: 'Dinner',
    dishes: [45, 46],
    dish_names: ['干煸芸豆', '清炖排骨汤'],
  },
  // ── 周日 ──
  {
    id: 19,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 7,
    day_display: 'Sunday',
    meal_time: 'B',
    meal_display: 'Breakfast',
    dishes: [47, 48],
    dish_names: ['牛肉面一碗', '煎蛋一个'],
  },
  {
    id: 20,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 7,
    day_display: 'Sunday',
    meal_time: 'L',
    meal_display: 'Lunch',
    dishes: [49, 50],
    dish_names: ['水煮鱼', '地三鲜'],
  },
  {
    id: 21,
    company: 1,
    company_name: 'XX医院',
    diet_category: 1,
    diet_category_name: '普食一',
    day_of_week: 7,
    day_display: 'Sunday',
    meal_time: 'D',
    meal_display: 'Dinner',
    dishes: [51, 52],
    dish_names: ['酱牛肉', '凉拌黄瓜'],
  },
];
