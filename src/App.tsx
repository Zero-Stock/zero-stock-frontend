import { Empty, Layout, theme } from 'antd';
import { Route, Switch } from 'wouter';
import Sidebar from './shared/components/Sidebar';
import Providers from './shared/providers';
import { renderRoutes, routes } from './Routes';
import BreadcrumbNav from './shared/components/BreadcrumbNav';

const { Header, Content, Footer } = Layout;

function NotFoundPage() {
  return <Empty description="Page not found" />;
}

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Providers>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header className="flex items-center">
          <div className="text-lg font-semibold text-white">Zero Stock</div>
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
