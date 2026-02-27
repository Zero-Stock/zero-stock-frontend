import { Route } from 'wouter';
import { type ReactNode, type ComponentType } from 'react';

import { HomeOutlined, DatabaseOutlined } from '@ant-design/icons';
import HomePage from './modules/auth/components/HomePage';
import MaterialListPage from './modules/material/pages/MaterialListPage';
import MaterialCreatePage from './modules/material/pages/MaterialCreatePage';

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
