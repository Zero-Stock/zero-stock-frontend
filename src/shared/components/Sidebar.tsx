import { useLocation } from 'wouter';
import { Layout, Menu, type MenuProps } from 'antd';
import { supplierMeta } from '@/modules/supplier/meta';
import { mealMeta } from '@/modules/meal/meta';
import { materialMeta } from '@/modules/material/meta';
import { censusMeta } from '@/modules/census/meta';
import { processingMeta } from '@/modules/processing/meta';
import { dishMeta } from '@/modules/dish/meta';
import { procurementMeta } from '@/modules/procurement/meta';

const { Sider } = Layout;

export type MenuItem = Required<MenuProps>['items'][number];

export const items: MenuItem[] = [
  ...mealMeta,
  ...materialMeta,
  ...censusMeta,
  ...procurementMeta,
  ...processingMeta,
  ...dishMeta,
  ...supplierMeta,
];

export default function Sidebar() {
  const [location, navigate] = useLocation();

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      trigger={null}
      width={220}
      theme="light"
      className="h-full overflow-auto"
    >
      <Menu
        items={items}
        mode="inline"
        selectedKeys={[location]}
        onClick={({ key }) => {
          if (typeof key === 'string') {
            navigate(key);
          }
        }}
        className="h-full border-none"
      />
    </Sider>
  );
}
