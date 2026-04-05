import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DailyWorkflowSection from '@/modules/home/components/DailyWorkflowSection';
import KeyCadenceSection from '@/modules/home/components/KeyCadenceSection';
import QuickStartSection from '@/modules/home/components/QuickStartSection';
import ShiftChecklistSection from '@/modules/home/components/ShiftChecklistSection';
import TodayOverviewSection from '@/modules/home/components/TodayOverviewSection';
import { LanguageProvider } from '@/shared/translation/LanguageContext';

const mockNavigate = vi.fn();

vi.mock('wouter', () => ({
  useLocation: () => ['/', mockNavigate] as const,
}));

function renderWithLanguage(ui: React.ReactElement) {
  localStorage.setItem('locale', 'en');
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Home sections', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('renders the today overview statistics', () => {
    renderWithLanguage(<TodayOverviewSection />);

    expect(screen.getByText('Today Overview')).toBeInTheDocument();
    expect(screen.getByText('Menu Items')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Readiness')).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('renders the daily workflow steps', () => {
    renderWithLanguage(<DailyWorkflowSection />);

    expect(screen.getByText('Daily Workflow')).toBeInTheDocument();
    expect(screen.getByText(/1\. Confirm Census/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Validate Meals/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Generate Orders and Prep/)).toBeInTheDocument();
  });

  it('renders cadence and checklist content', () => {
    renderWithLanguage(
      <>
        <KeyCadenceSection />
        <ShiftChecklistSection />
      </>,
    );

    expect(screen.getByText('Key Cadence')).toBeInTheDocument();
    expect(screen.getByText('08:30')).toBeInTheDocument();
    expect(screen.getByText('Shift Checklist')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Confirm the working date matches the date used for operational documents.',
      ),
    ).toBeInTheDocument();
  });

  it('navigates from quick start cards', async () => {
    const user = userEvent.setup();

    renderWithLanguage(<QuickStartSection />);

    await user.click(screen.getByText('Meals'));
    await user.click(screen.getByText('Census'));
    await user.click(screen.getByText('Procurement Order'));
    await user.click(screen.getByText('Processing'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/meal');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/census');
    expect(mockNavigate).toHaveBeenNthCalledWith(3, '/procurement/order');
    expect(mockNavigate).toHaveBeenNthCalledWith(4, '/processing');
  });
});
