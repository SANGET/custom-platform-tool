/*
 * @Author: wph
 * @Date: 2020-07-23 10:29:08
 * @LastEditTime: 2020-08-11 14:07:05
 * @LastEditors: Please set LastEditors
 * @Description: 添加注释
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\routes\index.ts
 */
/**
 * 表结构容器
 */
import TableStructContainer from '@provider-app/data-designer/src/pages/TableStruct';
/**
* 表结构-编辑页入口
*/
import EditStruct from '@provider-app/data-designer/src/pages/EditStruct';
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
    key: 'TableStructContainer',
    link: '/',
    /**
     * 注意:icon的名称一定要是@ant-design/icons存在的icon名称
     */
    icon: 'GoldOutlined',
    text: '表结构管理',
    component: TableStructContainer
  },
  {
    key: 'EditStruct',
    link: '/EditStruct',
    icon: 'ClusterOutlined',
    text: '编辑表',
    component: EditStruct
  },
  {
    key: 'Login',
    link: '/Login',
    icon: 'ClusterOutlined',
    text: '登陆页',
    component: Login
  }
];

export default ROUTES;
