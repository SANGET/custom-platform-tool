/*
 * @Author: your name
 * @Date: 2020-08-19 15:04:22
 * @LastEditTime: 2020-08-19 17:36:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\api\tableStruct.ts
 */
/**
 * 网络请求工具
 */
import Http from '@infra/utils/http';
/**
 * 扁平转嵌套方法
 */
import { listToTree } from '@provider-app/data-designer/src/tools/tree';

/**
 * 请求菜单树,表结构的表类型列依赖菜单树数据
 */
export const GetMenuTree = async () => {
  const menuTreeRes = await Http.get('/page/v1/menus/list', {});
  // const menuTreeRes = await Http.get('http://localhost:60001/mock/menu.json');
  return listToTree(menuTreeRes.data.result);
};

/**
 * 请求菜单树,表结构的表类型列依赖菜单树数据
 */
export const ReqCopyTableStructRecord = async (data) => {
  return await Http.post('/data/v1/tables/copy', data);
};
