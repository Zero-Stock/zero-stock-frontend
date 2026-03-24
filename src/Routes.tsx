import { Route } from 'wouter';
import { type ReactNode, type ComponentType } from 'react';

import {
  HomeOutlined,
  DatabaseOutlined,
  ReadOutlined,
  TeamOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  FireOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import HomePage from './modules/auth/pages/HomePage';
import MaterialListPage from './modules/material/pages/MaterialListPage';
import MaterialCreatePage from './modules/material/pages/MaterialCreatePage';
import MealListPage from './modules/meal/pages/MealListPage';
import DishListPage from './modules/dish/pages/DishListPage';
import type { TranslationKey } from './shared/i18n/translations';
import SupplierListPage from './modules/supplier/pages/SupplierListPage';
import SupplierCreatePage from './modules/supplier/pages/SupplierCreatePage';
import SupplierDetailPage from './modules/supplier/pages/SupplierDetailPage';
import CensusListPage from './modules/census/pages/CensusListPage';

export interface RouteConfig {
  path: string;
  title: string;
  titleKey?: TranslationKey;
  icon?: ReactNode;
  showInMenu?: boolean;
  component?: ComponentType<any>;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    title: 'Home',
    titleKey: 'navHome',
    icon: <HomeOutlined />,
    showInMenu: false,
    component: HomePage,
  },

  {
    path: '/meal',
    title: 'Meals',
    titleKey: 'navMeals',
    icon: <ReadOutlined />,
    showInMenu: true,
    component: MealListPage,
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
    // component: ProcurementListPage,
  },

  {
    path: '/processing',
    title: 'Processing',
    titleKey: 'navProcessing',
    icon: <ProfileOutlined />,
    showInMenu: true,
    // component: ProcessingListPage,
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
    titleKey: 'navSupplier',
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
