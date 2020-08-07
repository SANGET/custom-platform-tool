/*
 * @Author: wph
 * @Date: 2020-07-23 10:29:08
 * @LastEditTime: 2020-08-05 20:58:30
 * @LastEditors: Please set LastEditors
 * @Description: 添加注释
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\routes\index.ts
 */

import TableStruct from '@provider-app/data-design/src/pages/TableStruct';
// import TableKey from '../pages/tableKey';
// import Label from '../pages/label';

/** 页面的url用大驼峰 */
/**  URL请求中不采用大小写混合的驼峰命名方式，尽量采用全小写单词，如果需要连接多个单词，则采用连接符“_”连接单词 */
const ROUTES = [
  {
    key: 'TableStruct',
    link: '/',
    /** 注意:icon一定要是@ant-design/icons存在的icon */
    icon: 'GoldOutlined',
    text: '表结构管理',
    component: TableStruct
  },
  // {
  //   key: 'TableKey',
  //   link: '/table_key',
  //   icon: 'ClusterOutlined',
  //   text: '表字段管理',
  //   component: TableKey
  // },
  // {
  //   key: 'Label',
  //   link: '/label',
  //   icon: 'ClusterOutlined',
  //   text: '标签管理',
  //   component: Label
  // }
];

export default ROUTES;
