/*
 * @Author: your name
 * @Date: 2020-08-12 18:08:31
 * @LastEditTime: 2020-08-13 14:29:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\api\index.ts
 */
/**
 * 网络请求工具
 */
import Http from '@infra/utils/http';
/**
 * 树操作方法
 */
import { listToTree } from '@provider-app/data-designer/src/tools/tree';

/**
 * 请求菜单树,表结构的表类型列依赖菜单树数据
 */
export const fetchMenuTree = async () => {
  const menuTreeRes = await Http.get('http://localhost:60001/mock/menu.json', {});
  return listToTree(menuTreeRes.data.result);
};
