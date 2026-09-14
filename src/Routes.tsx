import { Route, Redirect } from 'wouter';
import {
  lazy,
  type LazyExoticComponent,
  type ReactNode,
  type ComponentType,
} from 'react';

import {
  HomeOutlined,
  BankOutlined,
  DatabaseOutlined,
  ReadOutlined,
  TeamOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  FireOutlined,
  ShopOutlined,
} from '@ant-design/icons';
type RouteComponent =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ComponentType<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | LazyExoticComponent<ComponentType<any>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyPage = <T extends ComponentType<any>>(
  load: () => Promise<{ default: T }>,
): LazyExoticComponent<T> => lazy(load);

const HomePage = lazyPage(() => import('./modules/home/pages/HomePage'));
const CompanyListPage = lazyPage(
  () => import('./modules/company/pages/CompanyListPage'),
);
const CompanyCreatePage = lazyPage(
  () => import('./modules/company/pages/CompanyCreatePage'),
);
const CompanyDetailPage = lazyPage(
  () => import('./modules/company/pages/CompanyDetailPage'),
);
const MaterialListPage = lazyPage(
  () => import('./modules/material/pages/MaterialListPage'),
);
const MaterialCreatePage = lazyPage(
  () => import('./modules/material/pages/MaterialCreatePage'),
);
const StapleListPage = lazyPage(
  () => import('./modules/staple/pages/StapleListPage'),
);
const DietBoardPage = lazyPage(
  () => import('./modules/diet/pages/DietBoardPage'),
);
const DishListPage = lazyPage(
  () => import('./modules/dish/pages/DishListPage'),
);
const SupplierListPage = lazyPage(
  () => import('./modules/supplier/pages/SupplierListPage'),
);
const SupplierCreatePage = lazyPage(
  () => import('./modules/supplier/pages/SupplierCreatePage'),
);
const SupplierUpdatePage = lazyPage(
  () => import('./modules/supplier/pages/SupplierUpdatePage'),
);
const SupplierDetailPage = lazyPage(
  () => import('./modules/supplier/pages/SupplierDetailPage'),
);
const CensusListPage = lazyPage(
  () => import('./modules/census/pages/CensusListPage'),
);
const PurchaseListPage = lazyPage(
  () => import('@/modules/purchase/pages/PurchaseOrderListPage'),
);
const PurchaseOrderDetailPage = lazyPage(
  () => import('@/modules/purchase/pages/PurchaseOrderDetailPage'),
);
const ReceivingListPage = lazyPage(
  () => import('./modules/receiving/pages/ReceivingListPage'),
);
const ProcessingListPage = lazyPage(
  () => import('./modules/processing/pages/ProcessingListPage'),
);

export interface RouteConfig {
  path: string;
  title: string;
  icon?: ReactNode;
  showInMenu?: boolean;
  component?: RouteComponent;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    title: '首页',
    icon: <HomeOutlined />,
    showInMenu: true,
    component: HomePage,
  },

  {
    path: '/company',
    title: '公司',
    icon: <BankOutlined />,
    showInMenu: true,
    component: CompanyListPage,
    children: [
      {
        path: '/company/create',
        title: '新建公司',
        showInMenu: false,
        component: CompanyCreatePage,
      },
      {
        path: '/company/:companyId',
        title: '公司详情',
        showInMenu: false,
        component: CompanyDetailPage,
      },
    ],
  },

  {
    path: '/diet',
    title: '膳食计划',
    icon: <ReadOutlined />,
    showInMenu: true,
    component: DietBoardPage,
  },

  {
    path: '/census',
    title: '人数统计',
    icon: <TeamOutlined />,
    showInMenu: true,
    component: CensusListPage,
  },

  {
    path: '/procurement',
    title: '采购管理',
    icon: <ShoppingCartOutlined />,
    showInMenu: true,
    children: [
      {
        path: '/procurement/purchase/',
        title: '采购单',
        showInMenu: true,
        component: PurchaseListPage,
        children: [
          {
            path: '/procurement/purchase/:id',
            title: '采购详情',
            showInMenu: false,
            component: PurchaseOrderDetailPage,
          },
        ],
      },
      {
        path: '/procurement/order',
        title: '采购跳转',
        showInMenu: false,
        component: () => <Redirect to="/procurement/purchase/" />,
      },
      {
        path: '/procurement/receiving',
        title: '收货单',
        showInMenu: true,
        component: ReceivingListPage,
      },
    ],
  },

  {
    path: '/processing',
    title: '加工管理',
    icon: <ProfileOutlined />,
    showInMenu: true,
    component: ProcessingListPage,
  },

  {
    path: '/dish',
    title: '菜品管理',
    icon: <FireOutlined />,
    showInMenu: true,
    component: DishListPage,
  },

  {
    path: '/supplier',
    title: '供应商',
    icon: <ShopOutlined />,
    showInMenu: true,
    component: SupplierListPage,
    children: [
      {
        path: '/supplier/create',
        title: '新建供应商',
        showInMenu: false,
        component: SupplierCreatePage,
      },
      {
        path: '/supplier/update/:supplierId',
        title: '编辑供应商',
        showInMenu: false,
        component: SupplierUpdatePage,
      },
      {
        path: '/supplier/:supplierId',
        title: '供应商详情',
        showInMenu: false,
        component: SupplierDetailPage,
      },
    ],
  },

  {
    path: '/material',
    title: '原料管理',
    icon: <DatabaseOutlined />,
    showInMenu: true,
    component: MaterialListPage,
    children: [
      {
        path: '/material/raw',
        title: '食材',
        showInMenu: true,
        component: MaterialListPage,
      },
      {
        path: '/material/staples',
        title: '主食',
        showInMenu: true,
        component: StapleListPage,
      },
      {
        path: '/material/create',
        title: '新建食材',
        showInMenu: false,
        component: MaterialCreatePage,
      },
    ],
  },
];

export function renderRoutes(routes: RouteConfig[]) {
  return routes.flatMap((route: RouteConfig) => {
    const elements: ReactNode[] = [];
    if (route.component) {
      elements.push(
        <Route
          key={route.path}
          path={route.path.replace(/\/+$/, '') || '/'}
          component={route.component}
        />,
      );
    }
    if (route.children) {
      elements.push(...renderRoutes(route.children));
    }
    return elements;
  });
}

// Deep search the route tree for a specific path
export function findRouteByPath(
  configs: RouteConfig[],
  path: string,
): RouteConfig | undefined {
  for (const route of configs) {
    const parts = route.path.replace(/\/$/, '').split('/');
    const actual = path.replace(/\/$/, '').split('/');
    if (
      parts.length === actual.length &&
      parts.every(
        (part, index) => part.startsWith(':') || part === actual[index],
      )
    )
      return route;
    if (route.children) {
      const found = findRouteByPath(route.children, path);
      if (found) return found;
    }
  }
  return undefined;
}
