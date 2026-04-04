import { DatePicker, Empty, Layout, theme, Button } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { Route, Switch } from 'wouter';
import Sidebar from './shared/components/Sidebar';
import Providers from './shared/providers';
import { renderRoutes, routes } from './Routes';
import BreadcrumbNav from './shared/components/BreadcrumbNav';
import ScrollToTop from './shared/components/ScrollToTop';
import dayjs from 'dayjs';
import { useTranslation } from './shared/translation/LanguageContext';
import { useDateStore } from './shared/stores/dateStore';

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
  const { date: currentDate, setDate: setCurrentDate } = useDateStore();

  return (
    <>
      <ScrollToTop />
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Header
        className="flex items-center justify-between"
        style={{ background: colorBgContainer, padding: '0 36px' }}
      >
        <span className="text-lg font-semibold">{t('appName')}</span>
        <div className="flex items-center gap-4">
          <span className="font-semibold">
            {t('todayIs')}
            {currentDate}
          </span>
          <DatePicker
            value={dayjs(currentDate)}
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

      <div className="flex flex-1 flex-col overflow-hidden px-9">
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

        <Footer
          className="text-center"
          style={{ padding: '6px 0', fontSize: 12, color: 'gray' }}
        >
          {t('footer', { year: String(new Date().getFullYear()) })}
        </Footer>
      </div>
    </Layout>
    </>
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
