import { Route } from 'wouter';
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
import type { TranslationKey } from './shared/translation/translations';

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
const SupplierDetailPage = lazyPage(
  () => import('./modules/supplier/pages/SupplierDetailPage'),
);
const CensusListPage = lazyPage(
  () => import('./modules/census/pages/CensusListPage'),
);
const ProcurementListPage = lazyPage(
  () => import('./modules/procurement/pages/ProcurementListPage'),
);
const ReceivingListPage = lazyPage(
  () => import('./modules/procurement/pages/ReceivingListPage'),
);
const ProcessingListPage = lazyPage(
  () => import('./modules/processing/pages/ProcessingListPage'),
);

export interface RouteConfig {
  path: string;
  title: string;
  titleKey?: TranslationKey;
  icon?: ReactNode;
  showInMenu?: boolean;
  component?: RouteComponent;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    title: 'Home',
    titleKey: 'navHome',
    icon: <HomeOutlined />,
    showInMenu: true,
    component: HomePage,
  },

  {
    path: '/company',
    title: 'Company',
    titleKey: 'commonCompany',
    icon: <BankOutlined />,
    showInMenu: true,
    component: CompanyListPage,
    children: [
      {
        path: '/company/create',
        title: 'Create Company',
        titleKey: 'navCreateCompany',
        showInMenu: false,
        component: CompanyCreatePage,
      },
      {
        path: '/company/:companyId',
        title: 'Company Detail',
        titleKey: 'navCompanyDetail',
        showInMenu: false,
        component: CompanyDetailPage,
      },
    ],
  },

  {
    path: '/diet',
    title: 'Diet',
    titleKey: 'navDiet',
    icon: <ReadOutlined />,
    showInMenu: true,
    component: DietBoardPage,
  },

  {
    path: '/census',
    title: 'Census',
    titleKey: 'navCensus',
    icon: <TeamOutlined />,
    showInMenu: true,
    component: CensusListPage,
  },

  {
    path: '/procurement',
    title: 'Procurement',
    titleKey: 'navProcurement',
    icon: <ShoppingCartOutlined />,
    showInMenu: true,
    children: [
      {
        path: '/procurement/order',
        title: 'Procurement Order',
        titleKey: 'navProcurementOrder',
        showInMenu: true,
        component: ProcurementListPage,
      },
      {
        path: '/procurement/receiving',
        title: 'Receiving Order',
        titleKey: 'navReceivingOrder',
        showInMenu: true,
        component: ReceivingListPage,
      },
    ],
  },

  {
    path: '/processing',
    title: 'Processing',
    titleKey: 'navProcessing',
    icon: <ProfileOutlined />,
    showInMenu: true,
    component: ProcessingListPage,
  },

  {
    path: '/dish',
    title: 'Dishes',
    titleKey: 'navDishes',
    icon: <FireOutlined />,
    showInMenu: true,
    component: DishListPage,
  },

  {
    path: '/supplier',
    title: 'Supplier',
    titleKey: 'commonSupplier',
    icon: <ShopOutlined />,
    showInMenu: true,
    component: SupplierListPage,
    children: [
      {
        path: '/supplier/create',
        title: 'Create Supplier',
        titleKey: 'navCreateSupplier',
        showInMenu: false,
        component: SupplierCreatePage,
      },
      {
        path: '/supplier/:supplierId',
        title: 'Supplier Detail',
        titleKey: 'navSupplierDetail',
        showInMenu: false,
        component: SupplierDetailPage,
      },
    ],
  },

  {
    path: '/material',
    title: 'Materials',
    titleKey: 'navMaterials',
    icon: <DatabaseOutlined />,
    showInMenu: true,
    component: MaterialListPage,
    children: [
      {
        path: '/material/raw',
        title: 'Raw Materials',
        titleKey: 'navRawMaterials',
        showInMenu: true,
        component: MaterialListPage,
      },
      {
        path: '/material/staples',
        title: 'Staples',
        titleKey: 'navStaples',
        showInMenu: true,
        component: StapleListPage,
      },
      {
        path: '/material/create',
        title: 'Create Material',
        titleKey: 'navCreateMaterial',
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
          path={route.path}
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
    if (route.path === path) return route;
    if (route.children) {
      const found = findRouteByPath(route.children, path);
      if (found) return found;
    }
  }
  return undefined;
}
