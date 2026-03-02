import { useLocation } from 'wouter';
import { Layout, Menu } from 'antd';
import { findRouteByPath, routes, type RouteConfig } from '@/Routes';
import { useMemo } from 'react';
import { useTranslation } from '@/shared/i18n/LanguageContext';

const { Sider } = Layout;

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();

  // Generate Menu Items (Recursive)
  const menuItems = useMemo(() => {
    const formatMenuItems = (configs: RouteConfig[]): any[] => {
      return configs
        .filter((r) => r.showInMenu)
        .map((r) => ({
          key: r.path,
          icon: r.icon,
          label: r.titleKey ? t(r.titleKey) : r.title,
          children: r.children?.some((c) => c.showInMenu)
            ? formatMenuItems(r.children)
            : undefined,
        }));
    };
    return formatMenuItems(routes);
  }, [routes, t]);

  // Find Active Key (Recursive)
  const selectedKey = useMemo(() => {
    const getActiveKey = (path: string): string => {
      const route = findRouteByPath(routes, path);

      if (route && route.showInMenu) {
        return route.path;
      }

      const lastSlashIndex = path.lastIndexOf('/');
      if (lastSlashIndex <= 0) return '/';

      return getActiveKey(path.substring(0, lastSlashIndex));
    };

    return getActiveKey(location);
  }, [location]);

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      trigger={null}
      width={230}
      theme="light"
      className="h-full"
    >
      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={[selectedKey]}
        onClick={(e) => setLocation(e.key)}
        className="border-none"
      />
    </Sider>
  );
}

