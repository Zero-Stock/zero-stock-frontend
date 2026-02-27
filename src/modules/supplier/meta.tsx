import { ShopOutlined } from '@ant-design/icons';
import { type MenuItem } from '@shared/components/Sidebar';

export const supplierMeta: MenuItem[] = [
  {
    key: '/supplier',
    label: '供应商管理',
    icon: <ShopOutlined />,
    // children: [
    // {
    //   key: '/supplier/list',
    //   label: '供应商列表',
    // },
    // {
    //   key: '/system/acl/application',
    //   label: '权限申请',
    // },
    // {
    //   key: '/system/acl/management',
    //   label: '权限管理',
    // },
    // ],
  },
];
