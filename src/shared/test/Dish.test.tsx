import {
  cleanup,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DishList from '@/modules/dish/components/DishList';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

const mockCreateDish = vi.fn();
const mockUpdateDish = vi.fn();
const mockDeleteDish = vi.fn();
const mockMutate = vi.fn();
const mockEditModal = vi.fn();

const dishes = [
  {
    id: 1,
    name: 'Tomato Egg',
    seasonings: 'Salt',
    cooking_method: 'Stir fry',
    ingredients: [
      {
        id: 11,
        raw_material: 21,
        raw_material_name: 'Tomato',
        net_quantity: '0.100',
        processing: 31,
        processing_name: 'Diced',
      },
    ],
  },
  {
    id: 2,
    name: 'Chicken Soup',
    seasonings: 'Pepper',
    cooking_method: 'Boil',
    ingredients: [
      {
        id: 12,
        raw_material: 22,
        raw_material_name: 'Chicken',
        net_quantity: '0.200',
        processing: 32,
        processing_name: 'Cut',
      },
    ],
  },
];

vi.mock('antd', () => {
  const Search = ({
    placeholder,
    onChange,
  }: {
    placeholder?: string;
    onChange?: (event: { target: { value: string } }) => void;
  }) => (
    <input type="search" placeholder={placeholder} onChange={onChange as any} />
  );

  return {
    Button: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => <button onClick={onClick}>{children}</button>,
    Input: { Search },
    Space: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Table: ({
      columns,
      dataSource,
    }: {
      columns: Array<Record<string, any>>;
      dataSource: Array<Record<string, any>>;
    }) => (
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((record) => (
            <tr key={record.id}>
              {columns.map((column) => {
                const value = record[column.dataIndex];
                const content = column.render
                  ? column.render(value, record)
                  : value;
                return <td key={column.key}>{content}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    Typography: {
      Title: ({ children }: { children: React.ReactNode }) => (
        <h3>{children}</h3>
      ),
    },
    Popconfirm: ({
      children,
      onConfirm,
    }: {
      children: React.ReactNode;
      onConfirm?: () => void | Promise<void>;
    }) => (
      <span
        onClick={() => {
          void onConfirm?.();
        }}
      >
        {children}
      </span>
    ),
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

vi.mock('@/modules/dish/hooks/useDishList', () => ({
  useDishList: () => ({
    dishes,
    isLoading: false,
    isError: null,
    mutate: mockMutate,
  }),
}));

vi.mock('@/modules/dish/hooks/useDishCreate', () => ({
  useDishCreate: () => ({
    trigger: mockCreateDish,
  }),
}));

vi.mock('@/modules/dish/hooks/useDishUpdate', () => ({
  useDishUpdate: () => ({
    trigger: mockUpdateDish,
  }),
}));

vi.mock('@/modules/dish/hooks/useDishDelete', () => ({
  useDishDelete: () => ({
    trigger: mockDeleteDish,
  }),
}));

vi.mock('@/modules/dish/components/DishEditModal', () => ({
  default: (props: {
    visible: boolean;
    record: (typeof dishes)[number] | null;
    onSave: (values: unknown) => void;
  }) => {
    mockEditModal(props);
    return (
      <div data-testid="dish-edit-modal">
        <button
          onClick={() => props.onSave({ id: 9, name: 'New Dish' } as any)}
        >
          Trigger Save
        </button>
      </div>
    );
  },
}));

describe('Dish module', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockCreateDish.mockReset();
    mockUpdateDish.mockReset();
    mockDeleteDish.mockReset();
    mockMutate.mockReset();
    mockEditModal.mockReset();
  });

  it('filters, opens create state, and deletes a dish', async () => {
    mockCreateDish.mockResolvedValue(undefined);
    mockDeleteDish.mockResolvedValue(undefined);
    mockMutate.mockResolvedValue({ results: { results: [dishes[1]] } });

    renderWithProviders(<DishList />);

    expect(
      screen.getAllByRole('heading', { name: 'Dish Recipe Sheet' }),
    ).toHaveLength(2);
    expect(screen.getByText('Tomato Egg')).toBeInTheDocument();
    expect(screen.getByText('Chicken Soup')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search dish'), {
      target: { value: 'Tomato' },
    });

    expect(screen.getByText('Tomato Egg')).toBeInTheDocument();
    expect(screen.queryByText('Chicken Soup')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'New Dish' }));

    expect(mockEditModal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        visible: true,
        record: null,
      }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Save' }));

    await waitFor(() => {
      expect(mockCreateDish).toHaveBeenCalled();
      expect(mockMutate).toHaveBeenCalled();
    });

    const row = screen.getByRole('row', { name: /Tomato Egg/i });
    fireEvent.click(within(row).getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(mockDeleteDish).toHaveBeenCalledWith(1);
    });
  });

  it('opens edit state for an existing dish and saves via update', async () => {
    mockUpdateDish.mockResolvedValue(undefined);

    renderWithProviders(<DishList />);

    fireEvent.click(
      within(screen.getByRole('row', { name: /Tomato Egg/i })).getByRole(
        'button',
        { name: 'Edit' },
      ),
    );

    expect(mockEditModal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        visible: true,
        record: dishes[0],
      }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Trigger Save' }));

    await waitFor(() => {
      expect(mockUpdateDish).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: 'New Dish',
        }),
      );
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
