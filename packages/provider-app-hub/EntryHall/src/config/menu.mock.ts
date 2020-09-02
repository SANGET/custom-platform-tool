interface MenuDataType {
  title: string
  icon: string
  id: string
  path?: string
  children?: MenuDataType[]
}

export const mockMenuData: MenuDataType[] = [
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
        path: '/page-manager'
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
