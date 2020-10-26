export default [{
  path: '/user',
  component: '../layouts/UserLayout',
  routes: [
    {
      name: 'login',
      path: '/user/login',
      component: './user/login',
    },
  ],
},
{
  path: '/',
  component: '../layouts/SecurityLayout',
  routes: [
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        {
          path: '/',
          redirect: '/dashboard',
        }, {
          path: '/page',
          component: './container',
        },
        {
          path: '/dashboard',
          name: 'Dashboard',
          icon: 'DashboardOutlined',
          component: './Welcome',
        },
        {
          component: './404',
        }
      ],
    },
    {
      component: './404',
    },
  ],
},
{
  component: './404',
}];
