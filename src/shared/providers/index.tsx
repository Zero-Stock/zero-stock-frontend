import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import type { ReactNode } from 'react';
import { SWRConfigProvider } from './SWRConfigProvider';
import {
  LanguageProvider,
  useTranslation,
} from '../translation/LanguageContext';

const APP_FONT_SIZE = 15;
const TAG_FONT_SIZE = 14;

export interface ProvidersProps {
  children: ReactNode;
}

function AntdLocaleWrapper({ children }: { children: ReactNode }) {
  const { locale } = useTranslation();
  return (
    <ConfigProvider
      locale={locale === 'zh' ? zhCN : enUS}
      theme={{
        cssVar: { key: 'app', prefix: 'ant' },
        token: { fontSize: APP_FONT_SIZE, colorPrimary: '#1677ff' },
      }}
      tag={{
        style: {
          fontSize: TAG_FONT_SIZE,
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 8,
          paddingRight: 8,
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
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
