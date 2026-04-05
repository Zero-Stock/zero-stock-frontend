import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CensusListPage from '@/modules/census/pages/CensusListPage';
import DishListPage from '@/modules/dish/pages/DishListPage';
import MaterialListPage from '@/modules/material/pages/MaterialListPage';
import MealListPage from '@/modules/meal/pages/MealListPage';
import ProcessingListPage from '@/modules/processing/pages/ProcessingListPage';
import ProcurementListPage from '@/modules/procurement/pages/ProcurementListPage';
import ReceivingListPage from '@/modules/procurement/pages/ReceivingListPage';
import SupplierCreatePage from '@/modules/supplier/pages/SupplierCreatePage';
import SupplierDetailPage from '@/modules/supplier/pages/SupplierDetailPage';
import SupplierListPage from '@/modules/supplier/pages/SupplierListPage';
import { LanguageProvider } from '@/shared/translation/LanguageContext';

vi.mock('@/modules/census/components/CensusTable', () => ({
  default: () => <div data-testid="census-page-component">Census page component</div>,
}));
vi.mock('@/modules/dish/components/DishList', () => ({
  default: () => <div data-testid="dish-page-component">Dish page component</div>,
}));
vi.mock('@/modules/material/components/MaterialList', () => ({
  default: () => <div data-testid="material-page-component">Material page component</div>,
}));
vi.mock('@/modules/meal/components/MealBoard', () => ({
  default: () => <div data-testid="meal-page-component">Meal page component</div>,
}));
vi.mock('@/modules/processing/components/ProcessingList', () => ({
  default: () => <div data-testid="processing-page-component">Processing page component</div>,
}));
vi.mock('@/modules/procurement/components/ProcurementList', () => ({
  default: () => <div data-testid="procurement-page-component">Procurement page component</div>,
}));
vi.mock('@/modules/procurement/components/ReceivingList', () => ({
  default: () => <div data-testid="receiving-page-component">Receiving page component</div>,
}));
vi.mock('@/modules/supplier/components/SupplierCreateForm', () => ({
  default: () => <div data-testid="supplier-create-page-component">Supplier create page component</div>,
}));
const mockSupplierDetail = vi.fn();
vi.mock('@/modules/supplier/components/SupplierDetail', () => ({
  default: (props: { supplierId: string }) => {
    mockSupplierDetail(props);
    return <div data-testid="supplier-detail-page-component">Supplier detail page component</div>;
  },
}));
vi.mock('@/modules/supplier/components/SupplierList', () => ({
  default: () => <div data-testid="supplier-list-page-component">Supplier list page component</div>,
}));

function renderWithLanguage(ui: React.ReactElement) {
  localStorage.setItem('locale', 'en');
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Page wrappers', () => {
  it('renders module wrapper pages', () => {
    renderWithLanguage(
      <>
        <CensusListPage />
        <DishListPage />
        <MaterialListPage />
        <MealListPage />
        <ProcessingListPage />
        <ProcurementListPage />
        <ReceivingListPage />
        <SupplierListPage />
      </>,
    );

    expect(screen.getByTestId('census-page-component')).toBeInTheDocument();
    expect(screen.getByTestId('dish-page-component')).toBeInTheDocument();
    expect(screen.getByTestId('material-page-component')).toBeInTheDocument();
    expect(screen.getByTestId('meal-page-component')).toBeInTheDocument();
    expect(screen.getByTestId('processing-page-component')).toBeInTheDocument();
    expect(screen.getByTestId('procurement-page-component')).toBeInTheDocument();
    expect(screen.getByTestId('receiving-page-component')).toBeInTheDocument();
    expect(screen.getByTestId('supplier-list-page-component')).toBeInTheDocument();
  });

  it('renders supplier create and detail pages', () => {
    renderWithLanguage(
      <>
        <SupplierCreatePage />
        <SupplierDetailPage params={{ supplierId: '42' }} />
      </>,
    );

    expect(screen.getByText('Add New Supplier')).toBeInTheDocument();
    expect(screen.getByTestId('supplier-create-page-component')).toBeInTheDocument();
    expect(screen.getByTestId('supplier-detail-page-component')).toBeInTheDocument();
    expect(mockSupplierDetail).toHaveBeenCalledWith(
      expect.objectContaining({ supplierId: '42' }),
    );
  });
});
