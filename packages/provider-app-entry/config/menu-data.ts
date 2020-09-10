export interface MenuDataType {
  /** 菜单名 */
  title: string
  /** icon */
  icon: string
  /** 菜单 id，用于 react 的 key */
  id: string
  /** 导航将要到达的 path */
  path?: string
  /** children，如果有，则认为点击没有跳转功能 */
  children?: MenuDataType[]
}

export const ProviderAppMenuData: MenuDataType[] = [
  {
    title: '页面设计',
    icon: '',
    id: '1',
    // path: '/menu-manager',
    children: [
      {
        title: '页面管理',
        id: '12',
        icon: '',
        path: '/page-manager'
      }
    ]
  },
  {
    // path: '/menu-manager',
    icon: '',
    title: '数据设计',
    id: '2',
    children: [
      {
        title: '表结构管理',
        id: '21',
        icon: '',
        path: '/TableStruct'
      },
      {
        title: '字典管理',
        id: '22',
        icon: '',
        path: '/DictManage'
      },
      {
        title: '其他数据源',
        id: '23',
        icon: '',
        children: [
          {
            title: '其他数据源',
            id: '23',
            icon: '',
            path: '/page-manager',
          }
        ]
      },
    ]
  },
];
