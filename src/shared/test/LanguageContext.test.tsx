import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  LanguageProvider,
  useTranslation,
} from '@/shared/translation/LanguageContext';

function TranslationProbe() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div>
      <span>{locale}</span>
      <span>{t('homeDateLabel', { date: '2026-04-04' })}</span>
      <button onClick={() => setLocale('zh')}>set-zh</button>
    </div>
  );
}

describe('LanguageContext', () => {
  it('uses stored locale and interpolates translation variables', () => {
    localStorage.setItem('locale', 'en');

    render(
      <LanguageProvider>
        <TranslationProbe />
      </LanguageProvider>,
    );

    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('Working date: 2026-04-04')).toBeInTheDocument();
  });

  it('updates locale and persists it to localStorage', () => {
    localStorage.setItem('locale', 'en');

    render(
      <LanguageProvider>
        <TranslationProbe />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'set-zh' }));

    expect(screen.getByText('zh')).toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith('locale', 'zh');
  });
});
