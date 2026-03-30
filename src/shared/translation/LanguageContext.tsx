import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Locale, type TranslationKey } from './translations';

interface LanguageContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(() => {
        const stored = localStorage.getItem('locale');
        return (stored === 'en' || stored === 'zh') ? stored : 'zh';
    });

    const handleSetLocale = useCallback((newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
    }, []);

    const t = useCallback(
        (key: TranslationKey, vars?: Record<string, string | number>): string => {
            let text: string = translations[key]?.[locale] ?? key;
            if (vars) {
                Object.entries(vars).forEach(([k, v]) => {
                    text = text.replace(`{${k}}`, String(v));
                });
            }
            return text;
        },
        [locale],
    );

    return (
        <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
    return ctx;
}

export type { Locale };
