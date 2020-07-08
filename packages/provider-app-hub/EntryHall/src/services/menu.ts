const GetMenu = () => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        path: '/',
        text: '工作台',
        id: 'root',
      },
      {
        path: '/menu-manager',
        text: '菜单管理',
        id: 1,
      },
      {
        path: '/page-manager',
        text: '页面管理',
        id: 2,
      },
      {
        path: '/data-manager',
        text: '数据管理',
        id: 3,
      },
      {
        path: '/page-designer',
        text: '页面设计器',
        id: 4,
      },
      {
        path: '/auth-manager',
        text: '权限管理',
        id: 5,
      },
    ]);
  });
};

export {
  GetMenu
};
