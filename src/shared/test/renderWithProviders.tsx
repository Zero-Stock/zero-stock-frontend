import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { LanguageProvider } from '@/shared/translation/LanguageContext';

export function renderWithProviders(ui: ReactElement) {
  localStorage.setItem('locale', 'en');

  return render(<LanguageProvider>{ui}</LanguageProvider>);
}
