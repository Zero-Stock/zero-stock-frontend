import { ShoppingCartOutlined } from '@ant-design/icons';
import { type MenuItem } from '@shared/components/Sidebar';

export const procurementMeta: MenuItem[] = [
  {
    key: '/procurement',
    label: '采购 / 收货清单',
    icon: <ShoppingCartOutlined />,
  },
];
