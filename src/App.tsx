import { Suspense } from 'react';
import { DatePicker, Empty, Layout, theme } from 'antd';
import { Route, Switch } from 'wouter';
import Sidebar from './shared/components/Sidebar';
import Providers from './shared/providers';
import { renderRoutes, routes } from './Routes';
import BreadcrumbNav from './shared/components/BreadcrumbNav';
import ScrollToTop from './shared/components/ScrollToTop';
import dayjs from 'dayjs';
import { useDateStore } from './shared/stores/dateStore';

const { Header, Content, Footer } = Layout;

function NotFoundPage() {
  return <Empty description={'页面未找到'} />;
}

function AppContent() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { date: currentDate, setDate: setCurrentDate } = useDateStore();

  return (
    <>
      <ScrollToTop />
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header
          className="flex items-center justify-between"
          style={{ background: colorBgContainer, padding: '0 36px' }}
        >
          <span className="text-lg font-semibold">
            {'零库存餐饮生产管理系统'}
          </span>
          <div className="flex items-center gap-4">
            <span className="font-semibold">
              {'今天是：'}
              {new Intl.DateTimeFormat('zh-CN', {
                timeZone: 'America/New_York',
              }).format(new Date())}
            </span>
            <DatePicker
              value={dayjs(currentDate)}
              onChange={(date) => date && setCurrentDate(date)}
            />
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
              <Suspense fallback={null}>
                <Switch>
                  {renderRoutes(routes)}
                  <Route component={NotFoundPage} />
                </Switch>
              </Suspense>
            </Content>
          </Layout>

          <Footer
            className="text-center"
            style={{ padding: '6px 0', fontSize: 12, color: 'gray' }}
          >
            {`零库存餐饮生产管理系统 ©${String(new Date().getFullYear())}`}
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
