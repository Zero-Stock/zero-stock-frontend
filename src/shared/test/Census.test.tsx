import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CensusListPage from '@/modules/census/pages/CensusListPage';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

vi.mock('@/modules/census/components/CensusTable', () => ({
  default: () => <div data-testid="census-table">Census Table Stub</div>,
}));

describe('Census module', () => {
  it('renders the census list page', () => {
    renderWithProviders(<CensusListPage />);

    expect(screen.getByTestId('census-table')).toHaveTextContent(
      'Census Table Stub',
    );
  });
});
