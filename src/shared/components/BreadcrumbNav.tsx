import { findRouteByPath, routes } from '@/Routes';
import { Breadcrumb, theme } from 'antd';
import { useLocation } from 'wouter';

const { useToken } = theme;

export default function BreadcrumbNav() {
  const [location] = useLocation();
  const { token } = useToken();

  const getBreadcrumbItems = (location: string) => {
    const items: any[] = [];

    // 1. ALWAYS add Home
    const homeRoute = findRouteByPath(routes, '/');
    const isAtHome = location === '/';

    items.push({
      // If we are at root, Home is the "last item" (no link)
      title: isAtHome ? (
        <span style={{ color: token.colorPrimary }}>{homeRoute?.title}</span>
      ) : (
        <a href="/">{homeRoute?.title}</a>
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
        items.push({
          title: isLast ? (
            <span style={{ color: token.colorPrimary }}>{route.title}</span>
          ) : (
            <a href={route.path}>{route.title}</a>
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
