import { describe, expect, it } from 'vitest';
import {
  dishToFormValues,
  formValuesToWritePayload,
  formatIngredient,
  formatIngredients,
  ingredientToForm,
} from '@/modules/dish/hooks/dishFormAdapter';

describe('dishFormAdapter', () => {
  it('maps ingredient fields into form values with category metadata', () => {
    expect(
      ingredientToForm(
        {
          id: 1,
          raw_material: 5,
          raw_material_name: 'Broccoli',
          net_quantity: '0.250',
          processing: 8,
          processing_name: 'Washed',
          yield_rate: 1,
        },
        [{ id: 5, category_name: 'Vegetables' }] as any,
      ),
    ).toEqual(
      expect.objectContaining({
        raw_material_id: 5,
        processing_id: 8,
        material: 'Broccoli',
        category: 'Vegetables',
        quantity: 250,
      }),
    );
  });

  it('converts dish data into form data', () => {
    expect(
      dishToFormValues(
        {
          name: 'Soup',
          seasonings: 'Salt',
          cooking_method: 'Boil',
          ingredients: [
            {
              id: 2,
              raw_material: 9,
              raw_material_name: 'Chicken',
              net_quantity: '0.300',
              processing: 4,
              processing_name: 'Cut',
              yield_rate: 1,
            },
          ],
        } as any,
        [{ id: 9, category_name: 'Protein' }] as any,
      ),
    ).toEqual(
      expect.objectContaining({
        name: 'Soup',
        seasonings: 'Salt',
        cooking_method: 'Boil',
        ingredients: [
          expect.objectContaining({
            raw_material_id: 9,
            category: 'Protein',
            quantity: 300,
          }),
        ],
      }),
    );
  });

  it('builds write payloads with kilogram strings', () => {
    expect(
      formValuesToWritePayload({
        name: 'Soup',
        seasonings: 'Salt',
        cooking_method: 'Boil',
        ingredients: [
          {
            raw_material_id: 9,
            processing_id: 4,
            quantity: 300,
          },
          {
            raw_material_id: undefined,
            processing_id: undefined,
            quantity: 50,
          },
        ],
      } as any),
    ).toEqual({
      name: 'Soup',
      seasonings: 'Salt',
      cooking_method: 'Boil',
      ingredients_write: [
        { raw_material: 9, processing: 4, net_quantity: '0.300' },
        { raw_material: 0, processing: null, net_quantity: '0.050' },
      ],
    });
  });

  it('formats ingredients with and without processing labels', () => {
    expect(
      formatIngredient({
        raw_material_name: 'Tomato',
        net_quantity: '0.120',
        processing_name: 'Diced',
      } as any),
    ).toBe('Tomato (Diced) 120g');

    expect(
      formatIngredient({
        raw_material_name: 'Rice',
        net_quantity: '0.080',
        processing_name: '无',
      } as any),
    ).toBe('Rice 80g');

    expect(
      formatIngredients([
        {
          raw_material_name: 'Tomato',
          net_quantity: '0.120',
          processing_name: 'Diced',
        },
        {
          raw_material_name: 'Rice',
          net_quantity: '0.080',
          processing_name: '',
        },
      ] as any),
    ).toBe('Tomato (Diced) 120g\nRice 80g');
  });
});
