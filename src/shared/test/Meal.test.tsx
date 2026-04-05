import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { Select, message } from 'antd';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MealBoard from '@/modules/meal/components/MealBoard';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

const mockCreateDiet = vi.fn();
const mockMutateDiets = vi.fn();
const mockMutateMenus = vi.fn();
const mockSaveWeeklyMenu = vi.fn();
const mockMealDayCards = vi.fn();
const mockMealEditModal = vi.fn();
const mockExportMealPdf = vi.fn();

const dayPlan = {
  day: 1,
  dayLabel: 'Mon',
  breakfast: [{ id: 101, name: 'Oatmeal' }],
  lunch: [{ id: 102, name: 'Rice Bowl' }],
  dinner: [{ id: 103, name: 'Soup' }],
};

vi.mock('@/modules/meal/apiAdapter', () => ({
  rowsToDayPlans: vi.fn(() => [dayPlan]),
  dayPlanToBatchItems: vi.fn(() => [{ day_of_week: 1 }]),
}));

vi.mock('@/modules/meal/hooks/useMealDietList', () => ({
  useMealDietList: () => ({
    diets: [{ id: 1, name: 'Regular' }],
    isLoading: false,
    isError: null,
    mutate: mockMutateDiets,
  }),
}));

vi.mock('@/modules/meal/hooks/useMealMenuList', () => ({
  useMealMenuList: () => ({
    menuRows: [{ id: 1, diet_category: 1 }],
    isLoading: false,
    isError: null,
    mutate: mockMutateMenus,
  }),
}));

vi.mock('@/modules/meal/hooks/useMealDishDetails', () => ({
  useMealDishDetails: () => ({
    dishDetails: [{ id: 101, name: 'Oatmeal' }],
    isLoading: false,
  }),
}));

vi.mock('@/modules/meal/hooks/useMealCreateDiet', () => ({
  useMealCreateDiet: () => ({
    trigger: mockCreateDiet,
  }),
}));

vi.mock('@/modules/meal/hooks/useMealUpdateDiet', () => ({
  useMealUpdateDiet: () => ({
    trigger: vi.fn(),
  }),
}));

vi.mock('@/modules/meal/hooks/useMealDeleteDiet', () => ({
  useMealDeleteDiet: () => ({
    trigger: vi.fn(),
  }),
}));

vi.mock('@/modules/meal/hooks/useMealSaveWeeklyMenu', () => ({
  useMealSaveWeeklyMenu: () => ({
    trigger: mockSaveWeeklyMenu,
  }),
}));

vi.mock('@/modules/meal/components/MealDayCards', () => ({
  default: (props: unknown) => {
    mockMealDayCards(props);
    return <button onClick={() => (props as any).onEdit(dayPlan)}>Edit Day</button>;
  },
}));

vi.mock('@/modules/meal/components/MealEditModal', () => ({
  default: (props: {
    visible: boolean;
    dayPlan: typeof dayPlan | null;
    onSave: (value: typeof dayPlan) => void;
  }) => {
    mockMealEditModal(props);
    return (
      <div data-testid="meal-edit-modal">
        <button onClick={() => props.onSave(dayPlan)}>Save Menu</button>
      </div>
    );
  },
}));

vi.mock('@/modules/meal/components/handleExportMealPdf', () => ({
  handleExportMealPdf: (payload: unknown) => mockExportMealPdf(payload),
  mealPrintStyles: 'body {}',
}));

describe('Meal module', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockCreateDiet.mockReset();
    mockMutateDiets.mockReset();
    mockMutateMenus.mockReset();
    mockSaveWeeklyMenu.mockReset();
    mockMealDayCards.mockReset();
    mockMealEditModal.mockReset();
    mockExportMealPdf.mockReset();
    vi.spyOn(Select, 'Option').mockRestore?.();
    vi.mocked(message.success).mockReset?.();
    vi.mocked(message.error).mockReset?.();
  });

  it('renders the meal board, exports, and saves an edited menu', async () => {
    const user = userEvent.setup();
    mockSaveWeeklyMenu.mockResolvedValue(undefined);

    renderWithProviders(<MealBoard />);

    expect(
      screen.getByRole('heading', { name: 'Standard Cycle Meals' }),
    ).toBeInTheDocument();

    expect(mockMealDayCards).toHaveBeenCalledWith(
      expect.objectContaining({
        days: [dayPlan],
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Export PDF / Print' }));

    expect(mockExportMealPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryName: 'Regular',
        dayPlans: [dayPlan],
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Edit Day' }));

    await waitFor(() => {
      expect(mockMealEditModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visible: true,
          dayData: dayPlan,
        }),
      );
    });

    await user.click(screen.getByRole('button', { name: 'Save Menu' }));

    await waitFor(() => {
      expect(mockSaveWeeklyMenu).toHaveBeenCalledWith([{ day_of_week: 1 }]);
      expect(mockMutateMenus).toHaveBeenCalled();
    });
  });

  it('adds a new diet category from the select popup', async () => {
    const user = userEvent.setup();
    mockCreateDiet.mockResolvedValue({ results: { id: 9, name: 'Low Sodium' } });

    renderWithProviders(<MealBoard />);

    const combo = screen.getByRole('combobox');
    fireEvent.mouseDown(combo);

    const input = await screen.findByPlaceholderText('New diet name');
    await user.type(input, 'Low Sodium');
    await user.click(screen.getByRole('button', { name: /Add/ }));

    await waitFor(() => {
      expect(mockCreateDiet).toHaveBeenCalledWith('Low Sodium');
      expect(mockMutateDiets).toHaveBeenCalled();
    });
  });
});
