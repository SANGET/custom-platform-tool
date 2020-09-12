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
  // const menuTreeRes = await Http.get('/page/v1/menus/list');
  const menuTreeRes = await $R_P.get('/page/v1/menus/list');
  // const menuTreeRes = await Http.get('http://localhost:60001/mock/menu.json');
  return listToTree(menuTreeRes.result);
};

/**
 * 请求菜单树,表结构的表类型列依赖菜单树数据
 */
export const ReqCopyTableStructRecord = async (data) => {
  const res = await $R_P.post('/data/v1/tables/copy', data);
  return res;
};

/** 请求表结构列表数据 */
export async function GetTableData(params) {
  return await $R_P.get({ params, url: '/data/v1/tables/list' });
}

/** 新建表数据提交 */

export async function SubmitTableData(values) {
  return await $R_P.post('/data/v1/tables/', values);
}
// 查询表详情
export async function ReqTableDetail(params) {
  return await $R_P.put({ url: '/data/v1/tables/', params });
}

/**
  * 删除表
  */
export async function DelTable(id) {
  return await $R_P.del(`/data/v1/tables/${id}`);
}
/* 新增字典 */
export async function AddDict(params) {
  return await $R_P.post('/data/v1/dictionary/', params);
}
// 修改字典
export async function UpdateDict(params) {
  return await $R_P.put('/data/v1/dictionary/', params);
}
/* 查询字典列表 */
export async function GetDictList(params) {
  return await $R_P.get({ url: '/data/v1/dictionary/list', params });
}

/**
  * 查询字典详情
  */
export async function GetDictDeatil(id) {
  return await $R_P.get(`/data/v1/dictionary/${id}`);
}

/**
  * 新增/修改子字典接口
  */
export async function AddUpdateSubDict(data) {
  return await $R_P.put("/data/v1/dictionary_value/", data);
}
/**
  * 查询子字典详情
  */
export async function GetSubDictDetail({ dictionaryId, pid }) {
  return await $R_P.get(`/data/v1/dictionary_value/${dictionaryId}/${pid}`);
}
/**
  *
  * 删除子字典
  */
export async function deleSubDict({ dictionaryId, pid }) {
  return await $R_P.del(`/data/v1/dictionary_value/${dictionaryId}/${pid}`);
}
