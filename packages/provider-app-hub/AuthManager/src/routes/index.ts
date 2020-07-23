/*
 * @Author: your name
 * @Date: 2020-07-23 10:29:08
 * @LastEditTime: 2020-07-23 10:34:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\routes\index.ts
 */
import AsyncCompnent from './asyncComp';

const authItem = AsyncCompnent(() => import('../features/authItem'));

const ROUTES = [
  {
    key: 'authItem',
    link: '/',
    iconType: 'home',
    text: '权限项',
    component: authItem
  },
  {
    key: 'authTree',
    link: '/authTree',
    iconType: 'profile',
    text: 'List',
    component: authItem
  }
  // {
  //   key: 'Marker',
  //   link: '/marker',
  //   iconType: 'edit',
  //   text: 'Marker',
  //   component: PageMarker
  // },
  // {
  //   key: 'Label',
  //   link: '/label',
  //   iconType: 'tag',
  //   text: 'Label',
  //   component: PageLabel
  // },
  // {
  //   key: 'Setting',
  //   link: '/setting',
  //   iconType: 'setting',
  //   text: 'Setting',
  //   component: PageSetting
  // }
];

export default ROUTES;
