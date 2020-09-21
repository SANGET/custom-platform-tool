export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  }];
