import type {
  DietMealSlotSchema,
  DietMealSlotUpsertSchema,
} from '@/shared/types/schema';

export interface DishItem {
  id: number;
  name: string;
  count?: number;
}

export interface DayPlan {
  dayOfWeek: string;
  dayNumber: number;
  breakfast: DishItem[];
  lunch: DishItem[];
  dinner: DishItem[];
}

const MEAL_TIME_MAP = {
  breakfast: 'B',
  lunch: 'L',
  dinner: 'D',
} satisfies Record<
  'breakfast' | 'lunch' | 'dinner',
  DietMealSlotSchema['meal_time']
>;

/**
 * Convert diet meal slots into grouped DayPlan[] for UI rendering.
 */
export function mealSlotsToDayPlans(
  mealSlots: DietMealSlotSchema[],
  dayLabel: (day: number) => string,
): DayPlan[] {
  const dayMap = new Map<
    number,
    { B: DishItem[]; L: DishItem[]; D: DishItem[] }
  >();

  for (const slot of mealSlots) {
    if (!dayMap.has(slot.day_of_week)) {
      dayMap.set(slot.day_of_week, { B: [], L: [], D: [] });
    }
    const slots = dayMap.get(slot.day_of_week)!;
    const items: DishItem[] = slot.dishes_detail.map((d) => ({
      id: d.dish_id,
      name: d.dish_name,
      count: d.quantity,
    }));
    slots[slot.meal_time] = items;
  }

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

export function dayPlanToMealSlotUpserts(
  day: DayPlan,
): DietMealSlotUpsertSchema[] {
  const items: DietMealSlotUpsertSchema[] = [];

  const meals: Array<{ key: keyof typeof MEAL_TIME_MAP; dishes: DishItem[] }> =
    [
      { key: 'breakfast', dishes: day.breakfast },
      { key: 'lunch', dishes: day.lunch },
      { key: 'dinner', dishes: day.dinner },
    ];

  for (const meal of meals) {
    items.push({
      day_of_week: day.dayNumber,
      meal_time: MEAL_TIME_MAP[meal.key],
      dishes: meal.dishes.map((d) => ({
        dish_id: d.id,
        quantity: d.count ?? 1,
      })),
    });
  }

  return items;
}
