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

export interface RouteConfig {
  path: string;
  title: string;
  icon?: ReactNode;
  showInMenu?: boolean;
  component?: ComponentType<any>;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    title: 'Home',
    icon: <HomeOutlined />,
    showInMenu: false,
    component: HomePage,
  },

  {
    path: '/meal',
    title: 'Meals',
    icon: <ReadOutlined />,
    showInMenu: true,
    component: MealListPage,
  },

  {
    path: '/census',
    title: 'Census',
    icon: <TeamOutlined />,
    showInMenu: true,
    // component: CensusListPage,
  },

  {
    path: '/procurement',
    title: 'Procurement',
    icon: <ShoppingCartOutlined />,
    showInMenu: true,
    // component: ProcurementListPage,
  },

  {
    path: '/processing',
    title: 'Processing',
    icon: <ProfileOutlined />,
    showInMenu: true,
    // component: ProcessingListPage,
  },

  {
    path: '/dish',
    title: 'Dishes',
    icon: <FireOutlined />,
    showInMenu: true,
    component: DishListPage,
  },

  {
    path: '/supplier',
    title: 'Supplier',
    icon: <ShopOutlined />,
    showInMenu: true,
    // component: SupplierListPage,
  },

  {
    path: '/material',
    title: 'Materials',
    icon: <DatabaseOutlined />,
    showInMenu: true,
    component: MaterialListPage,
    children: [
      {
        path: '/material/create',
        title: 'Create Material',
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
