const GetMenu = () => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        path: '/pageA',
        text: '页面A',
        id: 1,
      },
      {
        path: '/pageB',
        text: '页面B',
        id: 2,
      },
      {
        path: '/pageC',
        text: '页面C',
        id: 3,
      },
    ]);
  });
};

export {
  GetMenu
};
