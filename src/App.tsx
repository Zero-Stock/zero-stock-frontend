import { DatePicker, Empty, Layout, theme } from 'antd';
import { Route, Switch } from 'wouter';
import Sidebar from './shared/components/Sidebar';
import Providers from './shared/providers';
import { renderRoutes, routes } from './Routes';
import BreadcrumbNav from './shared/components/BreadcrumbNav';
import { useState } from 'react';
import dayjs from 'dayjs';

const { Header, Content, Footer } = Layout;

function NotFoundPage() {
  return <Empty description="Page not found" />;
}

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [currentDate, setCurrentDate] = useState(dayjs());

  return (
    <Providers>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header
          className="flex items-center justify-between"
          style={{ background: colorBgContainer }}
        >
          <span className="text-lg font-semibold">Zero Stock</span>
          <div className="flex items-center gap-4">
            <span className="font-semibold">
              Today is: {currentDate.format('YYYY-MM-DD')}
            </span>
            <DatePicker
              value={currentDate}
              onChange={(date) => date && setCurrentDate(date)}
            />
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
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </div>
      </Layout>
    </Providers>
  );
}

export default App;
