import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Modal, message } from 'antd';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProcurementList from '@/modules/procurement/components/ProcurementList';
import ReceivingList from '@/modules/procurement/components/ReceivingList';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

const mockGenerate = vi.fn();
const mockSubmit = vi.fn();
const mockAssignSuppliers = vi.fn();
const mockCreateReceiving = vi.fn();
const mockMutateList = vi.fn();
const mockMutateSheet = vi.fn();
const mockMutateProcurementItems = vi.fn();
const mockMutateTemplate = vi.fn();
const mockSupplierModal = vi.fn();
const mockExportPdf = vi.fn();

vi.mock('@/shared/stores/dateStore', () => ({
  useDateStore: (selector: (state: { date: string }) => unknown) =>
    selector({ date: '2026-04-04' }),
}));

vi.mock('@/modules/procurement/hooks/useProcurementList', () => ({
  useProcurementList: () => ({
    procurements: [{ id: 7 }],
    isLoading: false,
    mutate: mockMutateList,
  }),
}));

vi.mock('@/modules/procurement/hooks/useProcurementSheet', () => ({
  useProcurementSheet: () => ({
    items: [
      {
        name: 'Chicken Breast',
        category: 'Protein',
        demand_kg: 12,
        demand_unit_qty: 6,
        stock_kg: 1,
        stock_unit_qty: 0,
        purchase_kg: 11,
        purchase_unit_qty: 6,
        supplier: 'Farm Co',
        supplier_unit_name: 'Box',
        supplier_price: 5.25,
        supplier_kg_per_unit: 2,
      },
    ],
    isLoading: false,
    mutate: mockMutateSheet,
  }),
}));

vi.mock('@/modules/procurement/hooks/useProcurementItems', () => ({
  useProcurementItems: () => ({
    items: [
      {
        id: 91,
        raw_material: 41,
        raw_material_name: 'Chicken Breast',
      },
    ],
    isLoading: false,
    mutate: mockMutateProcurementItems,
  }),
}));

vi.mock('@/modules/procurement/hooks/useProcurementGenerate', () => ({
  useProcurementGenerate: () => ({
    trigger: mockGenerate,
  }),
}));

vi.mock('@/modules/procurement/hooks/useProcurementSubmit', () => ({
  useProcurementSubmit: () => ({
    trigger: mockSubmit,
  }),
}));

vi.mock('@/modules/procurement/hooks/useProcurementAssignSuppliers', () => ({
  useProcurementAssignSuppliers: () => ({
    trigger: mockAssignSuppliers,
  }),
}));

vi.mock('@/modules/procurement/hooks/useReceivingTemplate', () => ({
  useReceivingTemplate: () => ({
    template: {
      procurement_id: 7,
      items: [{ raw_material_id: 41, raw_material_name: 'Chicken Breast' }],
    },
    isLoading: false,
    mutate: mockMutateTemplate,
  }),
}));

vi.mock('@/modules/procurement/hooks/useReceivingCreate', () => ({
  useReceivingCreate: () => ({
    trigger: mockCreateReceiving,
  }),
}));

vi.mock(
  '@/modules/procurement/components/ProcurementSupplierEditModal',
  () => ({
    default: (props: {
      open: boolean;
      materialName: string;
      onSave: (supplierMaterialId: number | null) => void;
    }) => {
      mockSupplierModal(props);
      return (
        <div data-testid="supplier-edit-modal">
          <button onClick={() => props.onSave(55)}>Assign Supplier</button>
        </div>
      );
    },
  }),
);

vi.mock('@/modules/procurement/components/handleExportPdf', () => ({
  handleExportPdf: (payload: unknown) => mockExportPdf(payload),
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');

  return {
    ...actual,
    message: {
      ...actual.message,
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

describe('Procurement module', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    mockGenerate.mockReset();
    mockSubmit.mockReset();
    mockAssignSuppliers.mockReset();
    mockCreateReceiving.mockReset();
    mockMutateList.mockReset();
    mockMutateSheet.mockReset();
    mockMutateProcurementItems.mockReset();
    mockMutateTemplate.mockReset();
    mockSupplierModal.mockReset();
    mockExportPdf.mockReset();
    vi.mocked(message.success).mockReset();
    vi.mocked(message.error).mockReset();
    vi.mocked(message.warning).mockReset();
    vi.spyOn(Modal, 'confirm').mockImplementation(((config: {
      onOk?: () => void | Promise<void>;
    }) => {
      config.onOk?.();
    }) as typeof Modal.confirm);
  });

  it('generates procurement data and assigns a supplier', async () => {
    const user = userEvent.setup();
    mockGenerate.mockResolvedValue({ id: 12 });
    mockAssignSuppliers.mockResolvedValue(undefined);

    renderWithProviders(<ProcurementList />);

    expect(
      screen.getByRole('heading', { name: 'Procurement Order' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Regenerate' }));

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalledWith({ date: '2026-04-04' });
    });

    await waitFor(() => {
      expect(mockMutateList).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockMutateSheet).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockMutateProcurementItems).toHaveBeenCalled();
    });

    const row = screen.getByRole('row', { name: /Chicken Breast/i });
    await user.click(within(row).getByText('Edit'));

    await waitFor(() => {
      expect(mockSupplierModal).toHaveBeenCalled();
    });

    const assignButton = await screen.findByRole('button', {
      name: 'Assign Supplier',
    });
    await user.click(assignButton);

    await waitFor(() => {
      expect(mockAssignSuppliers).toHaveBeenCalled();
    });
  }, 10000);

  it('submits receiving quantities', async () => {
    const user = userEvent.setup();
    mockCreateReceiving.mockResolvedValue(undefined);

    renderWithProviders(<ReceivingList />);

    expect(
      screen.getByRole('heading', { name: 'Receiving Order' }),
    ).toBeInTheDocument();

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '8' } });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockCreateReceiving).toHaveBeenCalledWith({
        procurement_id: 7,
        items: [{ raw_material_id: 41, actual_quantity: 8 }],
      });
      expect(mockMutateList).toHaveBeenCalled();
      expect(mockMutateSheet).toHaveBeenCalled();
      expect(mockMutateTemplate).toHaveBeenCalled();
    });
  });
});
