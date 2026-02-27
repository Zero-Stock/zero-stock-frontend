import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { ReactNode } from 'react';
import { SWRConfigProvider } from './SWRConfigProvider';

export interface ProvidersProps {
  children: ReactNode;
}

export default function Providers(props: ProvidersProps) {
  const { children } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <SWRConfigProvider>{children}</SWRConfigProvider>
    </ConfigProvider>
  );
}
