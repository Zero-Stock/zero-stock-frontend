import { findRouteByPath, routes } from '@/Routes';
import { Breadcrumb, theme } from 'antd';
import type { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { useToken } = theme;

export default function BreadcrumbNav() {
  const [location] = useLocation();
  const { token } = useToken();
  const { t } = useTranslation();

  const getBreadcrumbItems = (location: string) => {
    const items: { title: ReactNode }[] = [];

    // 1. ALWAYS add Home
    const homeRoute = findRouteByPath(routes, '/');
    const isAtHome = location === '/';
    const homeTitle =
      homeRoute?.titleKey ? t(homeRoute.titleKey) : homeRoute?.title;

    items.push({
      // If we are at root, Home is the "last item" (no link)
      title: isAtHome ? (
        <span style={{ color: token.colorPrimary }}>{homeTitle}</span>
      ) : (
        <a href="/">{homeTitle}</a>
      ),
    });

    if (isAtHome) return items;

    // 2. Process the path segments
    const pathSnippets = location.split('/').filter((i) => i);
    let currentPath = '';

    pathSnippets.forEach((snippet, index) => {
      currentPath += `/${snippet}`;
      const isLast = index === pathSnippets.length - 1;
      const route = findRouteByPath(routes, currentPath);

      if (route) {
        const routeTitle = route.titleKey ? t(route.titleKey) : route.title;
        items.push({
          title: isLast ? (
            <span style={{ color: token.colorPrimary }}>{routeTitle}</span>
          ) : (
            <a href={route.path}>{routeTitle}</a>
          ),
        });
      }
    });

    return items;
  };

  return (
    <Breadcrumb
      items={getBreadcrumbItems(location)}
      style={{ margin: '16px 0' }}
    />
  );
}
