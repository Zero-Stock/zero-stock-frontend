import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from '@/modules/home/pages/HomePage';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

const mockNavigate = vi.fn();

vi.mock('wouter', () => ({
  useLocation: () => ['/', mockNavigate] as const,
}));

vi.mock('@/shared/stores/dateStore', () => ({
  useDateStore: (selector?: (state: { date: string }) => unknown) => {
    const state = { date: '2026-04-04' };
    return selector ? selector(state) : state;
  },
}));

vi.mock('@/modules/home/components/TodayOverviewSection', () => ({
  default: () => <div data-testid="today-overview">Today Overview Stub</div>,
}));

vi.mock('@/modules/home/components/QuickStartSection', () => ({
  default: () => <div data-testid="quick-start">Quick Start Stub</div>,
}));

vi.mock('@/modules/home/components/KeyCadenceSection', () => ({
  default: () => <div data-testid="key-cadence">Key Cadence Stub</div>,
}));

vi.mock('@/modules/home/components/DailyWorkflowSection', () => ({
  default: () => <div data-testid="daily-workflow">Daily Workflow Stub</div>,
}));

vi.mock('@/modules/home/components/ShiftChecklistSection', () => ({
  default: () => (
    <div data-testid="shift-checklist">Shift Checklist Stub</div>
  ),
}));

describe('Home module', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('renders the dashboard content and quick navigation actions', async () => {
    const user = userEvent.setup();

    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole('heading', {
        name: 'Start the day with meals, census, procurement, and processing aligned.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Working date: 2026-04-04')).toBeInTheDocument();
    expect(screen.getByText('Daily Operations Hub')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The home page brings together the key entry points in the zero-stock workflow so teams can move from headcount to menus, purchasing, and prep without friction.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('today-overview')).toBeInTheDocument();
    expect(screen.getByTestId('quick-start')).toBeInTheDocument();
    expect(screen.getByTestId('key-cadence')).toBeInTheDocument();
    expect(screen.getByTestId('daily-workflow')).toBeInTheDocument();
    expect(screen.getByTestId('shift-checklist')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Update Census First/ }),
    );
    await user.click(screen.getByRole('button', { name: /Review Meal Plan/ }));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/census');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/meal');
  });

  it('renders all supporting dashboard sections', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Today Overview Stub')).toBeInTheDocument();
    expect(screen.getByText('Quick Start Stub')).toBeInTheDocument();
    expect(screen.getByText('Key Cadence Stub')).toBeInTheDocument();
    expect(screen.getByText('Daily Workflow Stub')).toBeInTheDocument();
    expect(screen.getByText('Shift Checklist Stub')).toBeInTheDocument();
  });
});
