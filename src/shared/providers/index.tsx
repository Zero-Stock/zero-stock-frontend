import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { ReactNode } from 'react';
import { SWRConfigProvider } from './SWRConfigProvider';

const APP_FONT_SIZE = 15;
const TAG_FONT_SIZE = 14;

export interface ProvidersProps {
  children: ReactNode;
}

function AntdLocaleWrapper({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
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
    <AntdLocaleWrapper>
      <SWRConfigProvider>{children}</SWRConfigProvider>
    </AntdLocaleWrapper>
  );
}
