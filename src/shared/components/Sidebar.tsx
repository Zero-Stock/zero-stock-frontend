import { useLocation } from 'wouter';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { findRouteByPath, routes, type RouteConfig } from '@/Routes';
import { useMemo } from 'react';

const { Sider } = Layout;

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  // Generate Menu Items (Recursive)
  const menuItems = useMemo(() => {
    const formatMenuItems = (configs: RouteConfig[]): MenuProps['items'] => {
      return configs
        .filter((r) => r.showInMenu)
        .map((r) => ({
          key: r.path,
          icon: r.icon,
          label: r.title,
          children: r.children?.some((c) => c.showInMenu)
            ? formatMenuItems(r.children)
            : undefined,
        }));
    };
    return formatMenuItems(routes);
  }, []);

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

  const openKeys = ['/procurement', '/material'];

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
        defaultOpenKeys={openKeys}
        selectedKeys={[selectedKey]}
        onClick={(e) => setLocation(e.key)}
        className="border-none"
      />
    </Sider>
  );
}
