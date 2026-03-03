/**
 * Adapter functions to convert between backend WeeklyMenuRow[]
 * and the grouped DayPlan[] used by the UI.
 */
import type {
    WeeklyMenuRow,
    WeeklyMenuBatchItem,
    DayPlan,
    DishItem,
} from './mockdata';
import { MEAL_TIME_MAP } from './mockdata';

/**
 * Convert flat WeeklyMenuRow[] (from GET /api/weekly-menus/) into
 * a grouped DayPlan[] for UI rendering (7 days × 3 meals).
 *
 * Uses the `dishes_detail` field which provides `{ dish_id, dish_name, quantity }`
 * objects from the backend through-table.
 *
 * @param rows - flat rows from the API
 * @param dayLabel - function that returns the translated day name for a given day number (1-7)
 */
export function rowsToDayPlans(
    rows: WeeklyMenuRow[],
    dayLabel: (day: number) => string,
): DayPlan[] {
    // Build a map: dayNumber → { B: DishItem[], L: DishItem[], D: DishItem[] }
    const dayMap = new Map<
        number,
        { B: DishItem[]; L: DishItem[]; D: DishItem[] }
    >();

    for (const row of rows) {
        if (!dayMap.has(row.day_of_week)) {
            dayMap.set(row.day_of_week, { B: [], L: [], D: [] });
        }
        const slots = dayMap.get(row.day_of_week)!;
        // Map dishes_detail → UI DishItem
        const items: DishItem[] = row.dishes_detail.map((d) => ({
            id: d.dish_id,
            name: d.dish_name,
            count: d.quantity,
        }));
        slots[row.meal_time] = items;
    }

    // Produce 7 days (1..7), filling empty slots
    const plans: DayPlan[] = [];
    for (let d = 1; d <= 7; d++) {
        const slots = dayMap.get(d) ?? { B: [], L: [], D: [] };
        plans.push({
            dayOfWeek: dayLabel(d),
            dayNumber: d,
            breakfast: slots.B,
            lunch: slots.L,
            dinner: slots.D,
        });
    }

    return plans;
}

// ─── Frontend → Backend ───

/**
 * Convert a DayPlan into flat WeeklyMenuBatchItem[] for
 * POST /api/weekly-menus/batch/.
 *
 * Sends dishes as { dish_id, quantity } objects.
 */
export function dayPlanToBatchItems(
    day: DayPlan,
    company: number,
    dietCategoryId: number,
): WeeklyMenuBatchItem[] {
    const items: WeeklyMenuBatchItem[] = [];

    const meals: Array<{ key: keyof typeof MEAL_TIME_MAP; dishes: DishItem[] }> =
        [
            { key: 'breakfast', dishes: day.breakfast },
            { key: 'lunch', dishes: day.lunch },
            { key: 'dinner', dishes: day.dinner },
        ];

    for (const meal of meals) {
        // Always send the row even if empty (to clear a meal slot)
        items.push({
            company,
            diet_category: dietCategoryId,
            day_of_week: day.dayNumber,
            meal_time: MEAL_TIME_MAP[meal.key],
            // Send { dish_id, quantity } per dish
            dishes: meal.dishes.map((d) => ({
                dish_id: d.id,
                quantity: d.count ?? 1,
            })),
        });
    }

    return items;
}

/**
 * Convert a full week of DayPlan[] into batch items for saving.
 */
export function weekPlanToBatchItems(
    days: DayPlan[],
    company: number,
    dietCategoryId: number,
): WeeklyMenuBatchItem[] {
    return days.flatMap((day) =>
        dayPlanToBatchItems(day, company, dietCategoryId),
    );
}
