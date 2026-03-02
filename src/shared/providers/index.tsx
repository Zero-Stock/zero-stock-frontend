import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import type { ReactNode } from 'react';
import { SWRConfigProvider } from './SWRConfigProvider';
import { LanguageProvider, useTranslation } from '../i18n/LanguageContext';

export interface ProvidersProps {
  children: ReactNode;
}

function AntdLocaleWrapper({ children }: { children: ReactNode }) {
  const { locale } = useTranslation();
  return (
    <ConfigProvider locale={locale === 'zh' ? zhCN : enUS}>
      {children}
    </ConfigProvider>
  );
}

export default function Providers(props: ProvidersProps) {
  const { children } = props;

  return (
    <LanguageProvider>
      <AntdLocaleWrapper>
        <SWRConfigProvider>{children}</SWRConfigProvider>
      </AntdLocaleWrapper>
    </LanguageProvider>
  );
}
