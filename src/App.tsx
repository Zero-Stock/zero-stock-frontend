import { Breadcrumb, Empty, Layout, theme } from 'antd';
import { Route, Switch, useLocation } from 'wouter';
import MaterialCreatePage from './modules/material/pages/MaterialCreatePage';
import MaterialListPage from './modules/material/pages/MaterialListPage';
import Sidebar from './shared/components/Sidebar';
import Providers from './shared/providers';

const { Header, Content, Footer } = Layout;

function NotFoundPage() {
  return <Empty description="Page not found" />;
}

function App() {
  const [location] = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const breadcrumbItems =
    location === '/material/create'
      ? [{ title: 'Home' }, { title: 'Material' }, { title: 'Create' }]
      : [{ title: 'Home' }, { title: 'Material' }];

  return (
    <Providers>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header className="flex shrink-0 items-center">
          <div className="text-lg font-semibold text-white">Zero Stock</div>
        </Header>

        <div className="flex flex-1 flex-col overflow-hidden px-12">
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />

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
                <Route path="/" component={MaterialListPage} />
                <Route path="/material" component={MaterialListPage} />
                <Route path="/material/create" component={MaterialCreatePage} />
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
