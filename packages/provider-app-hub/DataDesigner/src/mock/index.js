/*
 * @Author: wph
 * @Date: 2020-07-25 10:15:08
 * @LastEditTime: 2020-08-06 17:23:16
 * @LastEditors: Please set LastEditors
 * @Description: 导入模拟数据
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\mock\index.js
 */
import { listToTree } from '@provider-app/data-designer/src/tools/tree';
// import { treeData } from './treeData';
import { tableData } from './tableData';

const foo = [
  {
    id: "1596617552627287f63679e9946efb46",
    created_by: "admin",
    gmt_create: "2020-08-05 16:52:32",
    modified_by: "admin",
    gmt_modified: "2020-08-05 16:52:32",
    name: "页面",
    type: 1,
    page_link: "yemian",
    icon: "primary",
    status: 0,
    pid: "1596617518864031d59b8c1034e29b98",
    sort: 2,
    level: 2,
    page_name: null
  },
  {
    id: "1596617518864031d59b8c1034e29b98",
    created_by: "admin",
    gmt_create: "2020-08-05 16:51:58",
    modified_by: "admin",
    gmt_modified: "2020-08-05 16:51:58",
    name: "人员管理",
    type: 0,
    page_link: null,
    icon: "btn-primary",
    status: 0,
    pid: null,
    sort: 1,
    level: 1,
    page_name: "人员管理页面"
  }
];
const treeData = listToTree(foo);
/** 模拟表格和树形数据 */
export {
  treeData,
  tableData
};
