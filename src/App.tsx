import { DatePicker, Empty, Layout, theme, Button } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { Route, Switch } from 'wouter';
import Sidebar from './shared/components/Sidebar';
import Providers from './shared/providers';
import { renderRoutes, routes } from './Routes';
import BreadcrumbNav from './shared/components/BreadcrumbNav';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from './shared/i18n/LanguageContext';

const { Header, Content, Footer } = Layout;

function NotFoundPage() {
  const { t } = useTranslation();
  return <Empty description={t('pageNotFound')} />;
}

function AppContent() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { locale, setLocale, t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(dayjs());

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Header
        className="flex items-center justify-between"
        style={{ background: colorBgContainer }}
      >
        <span className="text-lg font-semibold">{t('appName')}</span>
        <div className="flex items-center gap-4">
          <span className="font-semibold">
            {t('todayIs')}{currentDate.format('YYYY-MM-DD')}
          </span>
          <DatePicker
            value={currentDate}
            onChange={(date) => date && setCurrentDate(date)}
          />
          <Button
            type="text"
            icon={<TranslationOutlined />}
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            style={{ fontSize: 16 }}
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </Button>
        </div>
      </Header>

      <div className="flex flex-1 flex-col overflow-hidden px-12">
        <BreadcrumbNav />

        <Layout
          style={{
            flex: 1,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'hidden',
          }}
        >
          <Sidebar />

          <Content className="h-full overflow-y-auto p-8">
            <Switch>
              {renderRoutes(routes)}
              <Route component={NotFoundPage} />
            </Switch>
          </Content>
        </Layout>

        <Footer className="text-center" style={{ padding: '16px 0' }}>
          {t('footer', { year: String(new Date().getFullYear()) })}
        </Footer>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

export default App;
