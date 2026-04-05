import { describe, expect, it } from 'vitest';

import {
  dayPlanToBatchItems,
  rowsToDayPlans,
  weekPlanToBatchItems,
} from '@/modules/meal/apiAdapter';
import type { WeeklyMenuRow } from '@/modules/meal/mockdata';

describe('meal apiAdapter', () => {
  it('groups backend rows into seven day plans and fills missing days', () => {
    const rows: WeeklyMenuRow[] = [
      {
        id: 1,
        company: 9,
        company_name: 'Company',
        diet_category: 3,
        diet_category_name: 'Soft',
        day_of_week: 1,
        day_display: 'Monday',
        meal_time: 'B',
        meal_display: 'Breakfast',
        dishes: [11, 12],
        dish_names: ['Porridge', 'Egg'],
        dishes_detail: [
          { dish_id: 11, dish_name: 'Porridge', quantity: 2 },
          { dish_id: 12, dish_name: 'Egg', quantity: 1 },
        ],
      },
      {
        id: 2,
        company: 9,
        company_name: 'Company',
        diet_category: 3,
        diet_category_name: 'Soft',
        day_of_week: 1,
        day_display: 'Monday',
        meal_time: 'L',
        meal_display: 'Lunch',
        dishes: [13],
        dish_names: ['Soup'],
        dishes_detail: [{ dish_id: 13, dish_name: 'Soup', quantity: 4 }],
      },
      {
        id: 3,
        company: 9,
        company_name: 'Company',
        diet_category: 3,
        diet_category_name: 'Soft',
        day_of_week: 3,
        day_display: 'Wednesday',
        meal_time: 'D',
        meal_display: 'Dinner',
        dishes: [14],
        dish_names: ['Noodles'],
        dishes_detail: [{ dish_id: 14, dish_name: 'Noodles', quantity: 2 }],
      },
    ];

    const plans = rowsToDayPlans(rows, (day) => `Day ${day}`);

    expect(plans).toHaveLength(7);
    expect(plans[0]).toEqual({
      dayOfWeek: 'Day 1',
      dayNumber: 1,
      breakfast: [
        { id: 11, name: 'Porridge', count: 2 },
        { id: 12, name: 'Egg', count: 1 },
      ],
      lunch: [{ id: 13, name: 'Soup', count: 4 }],
      dinner: [],
    });
    expect(plans[1]).toEqual({
      dayOfWeek: 'Day 2',
      dayNumber: 2,
      breakfast: [],
      lunch: [],
      dinner: [],
    });
    expect(plans[2]).toEqual({
      dayOfWeek: 'Day 3',
      dayNumber: 3,
      breakfast: [],
      lunch: [],
      dinner: [{ id: 14, name: 'Noodles', count: 2 }],
    });
    expect(plans[6].dayOfWeek).toBe('Day 7');
  });

  it('converts a day plan into three backend meal rows and defaults quantity to one', () => {
    const items = dayPlanToBatchItems(
      {
        dayOfWeek: 'Monday',
        dayNumber: 1,
        breakfast: [
          { id: 21, name: 'Toast' },
          { id: 22, name: 'Milk', count: 3 },
        ],
        lunch: [],
        dinner: [{ id: 23, name: 'Rice', count: 2 }],
      },
      4,
      7,
    );

    expect(items).toEqual([
      {
        company: 4,
        diet_category: 7,
        day_of_week: 1,
        meal_time: 'B',
        dishes: [
          { dish_id: 21, quantity: 1 },
          { dish_id: 22, quantity: 3 },
        ],
      },
      {
        company: 4,
        diet_category: 7,
        day_of_week: 1,
        meal_time: 'L',
        dishes: [],
      },
      {
        company: 4,
        diet_category: 7,
        day_of_week: 1,
        meal_time: 'D',
        dishes: [{ dish_id: 23, quantity: 2 }],
      },
    ]);
  });

  it('flattens a weekly plan into batch items for every meal slot', () => {
    const items = weekPlanToBatchItems(
      [
        {
          dayOfWeek: 'Monday',
          dayNumber: 1,
          breakfast: [{ id: 1, name: 'Congee', count: 2 }],
          lunch: [],
          dinner: [],
        },
        {
          dayOfWeek: 'Tuesday',
          dayNumber: 2,
          breakfast: [],
          lunch: [{ id: 2, name: 'Fish', count: 1 }],
          dinner: [{ id: 3, name: 'Soup', count: 5 }],
        },
      ],
      8,
      6,
    );

    expect(items).toHaveLength(6);
    expect(items[0]).toMatchObject({
      company: 8,
      diet_category: 6,
      day_of_week: 1,
      meal_time: 'B',
    });
    expect(items[3]).toMatchObject({
      company: 8,
      diet_category: 6,
      day_of_week: 2,
      meal_time: 'B',
      dishes: [],
    });
    expect(items[4]).toMatchObject({
      day_of_week: 2,
      meal_time: 'L',
      dishes: [{ dish_id: 2, quantity: 1 }],
    });
    expect(items[5]).toMatchObject({
      day_of_week: 2,
      meal_time: 'D',
      dishes: [{ dish_id: 3, quantity: 5 }],
    });
  });
});
