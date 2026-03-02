/**
 * Adapter functions to convert between backend flat WeeklyMenuRow[]
 * and the grouped DayPlan[] used by the UI.
 */
import type {
    WeeklyMenuRow,
    WeeklyMenuBatchItem,
    DayPlan,
    DishItem,
} from './mockdata';
import { DAY_LABELS, MEAL_TIME_MAP } from './mockdata';

// ─── Backend → Frontend ───

/**
 * Convert flat WeeklyMenuRow[] (from GET /api/weekly-menus/) into
 * a grouped DayPlan[] for UI rendering (7 days × 3 meals).
 */
export function rowsToDayPlans(rows: WeeklyMenuRow[]): DayPlan[] {
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
        // Collapse repeated IDs into { id, name, count }
        const collapsed: DishItem[] = [];
        for (let i = 0; i < row.dishes.length; i++) {
            const dishId = row.dishes[i];
            const existing = collapsed.find((d) => d.id === dishId);
            if (existing) {
                existing.count = (existing.count ?? 1) + 1;
            } else {
                collapsed.push({
                    id: dishId,
                    name: row.dish_names[i] ?? `菜品#${dishId}`,
                    count: 1,
                });
            }
        }
        slots[row.meal_time] = collapsed;
    }

    // Produce 7 days (1..7), filling empty slots
    const plans: DayPlan[] = [];
    for (let d = 1; d <= 7; d++) {
        const slots = dayMap.get(d) ?? { B: [], L: [], D: [] };
        plans.push({
            dayOfWeek: DAY_LABELS[d],
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
 * Only includes meal slots that have at least one dish.
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
            // Expand count into repeated IDs: { id: 1, count: 3 } → [1, 1, 1]
            dishes: meal.dishes.flatMap((d) =>
                Array(d.count ?? 1).fill(d.id),
            ),
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
