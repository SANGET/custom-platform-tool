/*
 * @Author: wph
 * @Date: 2020-07-23 10:29:08
 * @LastEditTime: 2020-08-17 21:37:22
 * @LastEditors: Please set LastEditors
 * @Description: 添加注释
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\routes\index.ts
 */
/**
 * 表结构容器
 */

import TableStruct from '@provider-app/data-designer/src/pages/TableStruct';
/**
* 表结构-编辑页入口
*/
import EditStruct from '@provider-app/data-designer/src/pages/EditStruct';

// import ForeignKeySet from '@provider-app/data-designer/src/pages/EditStruct/ForeignKeySet';

// import ReferenceTable from '@provider-app/data-designer/src/pages/EditStruct/ReferenceTable';

import DictManage from '@provider-app/data-designer/src/pages/DictManage';

/**
* 登录页
*/
import Login from '@provider-app/data-designer/src/pages/Login';

// import Label from '../pages/label';

/**
 * 页面的url用大驼峰
 */
/**  URL请求中不采用大小写混合的驼峰命名方式，尽量采用全小写单词，如果需要连接多个单词，则采用连接符“_”连接单词 */
const ROUTES = [
  {
    key: 'TableStruct',
    link: '/',
    /**
     * 注意:icon的名称一定要是@ant-design/icons存在的icon名称
     */
    icon: 'GoldOutlined',
    text: '表结构管理',
    component: TableStruct
  },
  {
    key: 'DictManage',
    link: '/DictManage',
    icon: 'ClusterOutlined',
    text: '字典管理',
    component: DictManage
  },
  {
    key: 'EditStruct',
    link: '/EditStruct/:id',
    icon: 'ClusterOutlined',
    text: '编辑表',
    component: EditStruct
  },
  // {
  //   key: 'ForeignKeySet',
  //   link: '/ForeignKeySet',
  //   icon: 'ClusterOutlined',
  //   text: '外键设置',
  //   component: ForeignKeySet
  // },
  // {
  //   key: 'ReferenceTable',
  //   link: '/ReferenceTable',
  //   icon: 'ClusterOutlined',
  //   text: '引用表',
  //   component: ReferenceTable
  // },
  // {
  //   key: 'Login',
  //   link: '/Login',
  //   icon: 'ClusterOutlined',
  //   text: '登陆页',
  //   component: Login
  // },

];

export default ROUTES;
