import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SupplierList from '@/modules/supplier/components/SupplierList';
import SupplierDetail from '@/modules/supplier/components/SupplierDetail';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

const mockNavigate = vi.fn();
const mockUseSupplierList = vi.fn();
const mockUpdateSupplier = vi.fn();
const mockDeleteSupplier = vi.fn();
const mockDetailMutate = vi.fn();
const mockEditModal = vi.fn();
const mockUseSupplierDetail = vi.fn();

vi.mock('wouter', () => ({
  useLocation: () => ['/supplier', mockNavigate] as const,
}));

vi.mock('@/modules/supplier/hooks/useSupplierList', () => ({
  useSupplierList: (payload?: unknown) => mockUseSupplierList(payload),
}));

vi.mock('@/modules/supplier/hooks/useSupplierUpdate', () => ({
  useSupplierUpdate: () => ({
    trigger: mockUpdateSupplier,
  }),
}));

vi.mock('@/modules/supplier/hooks/useSupplierDelete', () => ({
  useSupplierDelete: () => ({
    trigger: mockDeleteSupplier,
  }),
}));

vi.mock('@/modules/supplier/hooks/useSupplierDetail', () => ({
  useSupplierDetail: (id: number) => mockUseSupplierDetail(id),
}));

vi.mock('@/modules/supplier/components/SupplierEditModal', () => ({
  default: (props: {
    open: boolean;
    supplier: unknown;
    onSave: (payload: unknown) => void;
  }) => {
    mockEditModal(props);
    return (
      <div data-testid="supplier-edit-modal">
        <button
          onClick={() =>
            props.onSave({
              id: 7,
              name: 'Fresh Farm Updated',
              contact_person: 'Alice',
              phone: '555-1234',
              address: '1 Market St',
            })
          }
        >
          Save Supplier
        </button>
      </div>
    );
  },
}));

vi.mock('@/modules/supplier/components/SupplierMaterialTable', () => ({
  default: ({ supplierId }: { supplierId: number }) => (
    <div data-testid="supplier-material-table">Materials for {supplierId}</div>
  ),
}));

describe('Supplier module', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseSupplierList.mockReset();
    mockUpdateSupplier.mockReset();
    mockDeleteSupplier.mockReset();
    mockDetailMutate.mockReset();
    mockEditModal.mockReset();
    mockUseSupplierDetail.mockReset();

    mockUseSupplierList.mockReturnValue({
      suppliers: [
        {
          id: 7,
          name: 'Fresh Farm',
          contact_person: 'Alice',
          phone: '555-1234',
          address: '1 Market St',
        },
      ],
      isLoading: false,
      mutate: mockDetailMutate,
    });

    mockUseSupplierDetail.mockReturnValue({
      supplier: {
        id: 7,
        name: 'Fresh Farm',
        contact_person: 'Alice',
        phone: '555-1234',
        address: '1 Market St',
      },
      isLoading: false,
      mutate: mockDetailMutate,
    });
  });

  it('renders supplier rows and supports navigation and editing', async () => {
    const user = userEvent.setup();
    mockUpdateSupplier.mockResolvedValue(undefined);

    renderWithProviders(<SupplierList />);

    expect(
      screen.getByRole('heading', { name: 'Supplier List' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Fresh Farm')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create Supplier' }));
    expect(mockNavigate).toHaveBeenCalledWith('/supplier/create');

    const row = screen.getByRole('row', { name: /Fresh Farm/i });
    await user.click(within(row).getByRole('button', { name: 'Detail' }));
    expect(mockNavigate).toHaveBeenCalledWith('/supplier/7');

    await user.click(within(row).getByRole('button', { name: 'Edit' }));

    await waitFor(() => {
      expect(mockEditModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          open: true,
          supplier: expect.objectContaining({ id: 7, name: 'Fresh Farm' }),
        }),
      );
    });

    await user.click(screen.getByRole('button', { name: 'Save Supplier' }));

    await waitFor(() => {
      expect(mockUpdateSupplier).toHaveBeenCalledWith(
        expect.objectContaining({ id: 7, name: 'Fresh Farm Updated' }),
      );
      expect(mockDetailMutate).toHaveBeenCalled();
    });
  }, 10000);

  it('passes the search keyword into the supplier list hook', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SupplierList />);

    const input = screen.getByPlaceholderText('Search supplier name');
    await user.clear(input);
    await user.type(input, 'Fresh');

    expect(mockUseSupplierList).toHaveBeenLastCalledWith({ search: 'Fresh' });
  });

  it('renders supplier detail and updates the supplier', async () => {
    const user = userEvent.setup();
    mockUpdateSupplier.mockResolvedValue(undefined);

    renderWithProviders(<SupplierDetail supplierId="7" />);

    expect(screen.getByRole('heading', { name: 'Fresh Farm' })).toBeInTheDocument();
    expect(screen.getByText(/Alice · 555-1234 · 1 Market St/)).toBeInTheDocument();
    expect(screen.getByTestId('supplier-material-table')).toHaveTextContent(
      'Materials for 7',
    );

    await user.click(screen.getByRole('button', { name: 'Edit Supplier' }));

    await waitFor(() => {
      expect(mockEditModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          open: true,
          supplier: expect.objectContaining({ id: 7 }),
        }),
      );
    });

    await user.click(screen.getByRole('button', { name: 'Save Supplier' }));

    await waitFor(() => {
      expect(mockUpdateSupplier).toHaveBeenCalled();
      expect(mockDetailMutate).toHaveBeenCalled();
    });
  });

  it('shows a loading state while supplier detail is loading', () => {
    mockUseSupplierDetail.mockReturnValue({
      supplier: undefined,
      isLoading: true,
      mutate: mockDetailMutate,
    });

    renderWithProviders(<SupplierDetail supplierId="7" />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders the not found state and navigates back to the supplier list', async () => {
    const user = userEvent.setup();
    mockUseSupplierDetail.mockReturnValue({
      supplier: undefined,
      isLoading: false,
      mutate: mockDetailMutate,
    });

    renderWithProviders(<SupplierDetail supplierId="999" />);

    expect(
      screen.getByRole('heading', { name: 'Supplier not found' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(mockNavigate).toHaveBeenCalledWith('/supplier');
  });
});
