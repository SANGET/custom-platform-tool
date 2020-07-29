/*
 * @Author: wph
 * @Date: 2020-07-23 10:29:08
 * @LastEditTime: 2020-07-29 13:59:11
 * @LastEditors: Please set LastEditors
 * @Description: 添加注释
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\routes\index.ts
 */

import AuthItem from '../pages/authItem';
import AuthTree from '../pages/authTree';

const ROUTES = [
  {
    key: 'authItem',
    link: '/',
    /** 注意:icon一定要是@ant-design/icons存在的icon */
    icon: 'GoldOutlined',
    text: '权限项',
    component: AuthItem
  },
  {
    key: 'authTree',
    link: '/authTree',
    icon: 'ClusterOutlined',
    text: '权限树',
    component: AuthTree
  }
];

export default ROUTES;
