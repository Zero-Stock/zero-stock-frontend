import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/shared/translation/LanguageContext';
import MaterialList from '@/modules/material/components/MaterialList';
import MaterialCreatePage from '@/modules/material/pages/MaterialCreatePage';
import type {
  MaterialPreviewSchema,
  MaterialQuerySchema,
} from '@/shared/types/schema';

const mockNavigate = vi.fn();
const mockUseMaterialList = vi.fn();
const mockDeleteTrigger = vi.fn();
const mockMutate = vi.fn();
const mockEditModal = vi.fn();

vi.mock('wouter', () => ({
  useLocation: () => ['/material', mockNavigate] as const,
}));

vi.mock('@/modules/material/hooks/useMaterialList', () => ({
  useMaterialList: (payload?: MaterialQuerySchema) =>
    mockUseMaterialList(payload),
}));

vi.mock('@/modules/material/hooks/useMaterialCategories', () => ({
  default: () => ({
    categoryOptions: [
      { label: 'Vegetables', value: 1 },
      { label: 'Protein', value: 2 },
    ],
    isLoading: false,
  }),
}));

vi.mock('@/modules/material/hooks/useMaterialDelete', () => ({
  useMaterialDelete: () => ({
    trigger: mockDeleteTrigger,
  }),
}));

vi.mock('@/modules/material/components/MaterialEditModal', () => ({
  default: (props: unknown) => {
    mockEditModal(props);
    return <div data-testid="material-edit-modal" />;
  },
}));

vi.mock('@/modules/material/components/NewMaterialForm', () => ({
  default: () => <div data-testid="new-material-form" />,
}));

const materials: MaterialPreviewSchema[] = [
  {
    id: 1,
    name: 'Chicken Breast',
    category_id: 2,
    category_name: 'Protein',
    yield_rate: '0.85',
    processing: [{ id: 1, name: 'Trimmed' }],
  },
  {
    id: 2,
    name: 'Broccoli',
    category_id: 1,
    category_name: 'Vegetables',
    yield_rate: '0.92',
    processing: [{ id: 2, name: 'Washed' }],
  },
];

function renderMaterialList() {
  localStorage.setItem('locale', 'en');

  return render(
    <LanguageProvider>
      <MaterialList />
    </LanguageProvider>,
  );
}

describe('MaterialList', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseMaterialList.mockReset();
    mockDeleteTrigger.mockReset();
    mockMutate.mockReset();
    mockEditModal.mockReset();

    mockUseMaterialList.mockImplementation(() => ({
      materials,
      isLoading: false,
      mutate: mockMutate,
    }));
  });

  it('renders material rows and opens the create flow', async () => {
    const user = userEvent.setup();

    renderMaterialList();

    expect(
      screen.getByRole('heading', { name: 'Materials' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('Broccoli')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Trimmed')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'New Material' }));

    expect(mockNavigate).toHaveBeenCalledWith('/material/create');
  });

  it('renders the category filter options', async () => {
    renderMaterialList();

    expect(mockUseMaterialList).toHaveBeenCalledWith({
      category_id: undefined,
      name: undefined,
    });
    expect(screen.getByText('Filter by Category:')).toBeInTheDocument();

    const select = document.querySelector('.ant-select');
    expect(select).not.toBeNull();

    fireEvent.mouseDown(select!);

    expect(
      await screen.findByRole('option', { name: 'Vegetables' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Protein' })).toBeInTheDocument();
  });

  it('searches materials by name', async () => {
    const user = userEvent.setup();

    renderMaterialList();

    await user.type(
      screen.getByPlaceholderText('Search material name'),
      'Chicken',
    );

    await waitFor(() => {
      expect(mockUseMaterialList).toHaveBeenLastCalledWith({
        category_id: undefined,
        name: 'Chicken',
      });
    });
  });

  it('opens edit state and deletes a material', async () => {
    const user = userEvent.setup();
    mockDeleteTrigger.mockResolvedValue(undefined);

    renderMaterialList();

    const chickenRow = screen.getByRole('row', { name: /Chicken Breast/i });
    const editLink = within(chickenRow).getByText('Edit');
    const deleteButton = within(chickenRow).getByRole('button', {
      name: 'Delete',
    });

    await user.click(editLink);

    await waitFor(() => {
      expect(mockEditModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          visible: true,
          record: materials[0],
        }),
      );
    });

    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTrigger).toHaveBeenCalledWith(1);
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('renders the material create page', () => {
    localStorage.setItem('locale', 'en');

    render(
      <LanguageProvider>
        <MaterialCreatePage />
      </LanguageProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Add New Materials' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('new-material-form')).toBeInTheDocument();
  });
});
