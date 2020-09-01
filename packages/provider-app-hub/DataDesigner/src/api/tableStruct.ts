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
  // const menuTreeRes = await Http.get('/page/v1/menus/list');
  const menuTreeRes = await $R_P.get('/smart_building/page/v1/menus/list');
  // const menuTreeRes = await Http.get('http://localhost:60001/mock/menu.json');
  return listToTree(menuTreeRes.result);
};

/**
 * 请求菜单树,表结构的表类型列依赖菜单树数据
 */
export const ReqCopyTableStructRecord = async (data) => {
  return await $R_P.post('/smart_building/data/v1/tables/copy', data);
};


/** 请求表结构列表数据 */
export async function GetTableData(params){
  return await $R_P.get('/smart_building/data/v1/tables/list', params);
}

/** 新建表数据提交 */

export async function SubmitTableData(values){
  return await $R_P.post('/smart_building/data/v1/tables', values)
}

/*新增或者修改字典*/
export async function AddOrUpdateDict(reqMethod,params){
 reqMethod === 'post'?await $R_P.post('/smart_building/data/v1/dictionary',params):await $R_P.put('/smart_building/data/v1/dictionary',params)
}

/*查询字典列表*/
export async function GetDictList(params){
  return await $R_P.get('/smart_building/data/v1/dictionary/list',  params )
}

/**
  * 查询字典详情
  */
 export async function GetDictDeatil(id){
  return $R_P.get(`/smart_building/data/v1/dictionary/${id}`)
 }

 /**
  * 删除字典
  */
 export async function DelDict(id){
  return await $R_P.get(`/smart_building/data/v1/tables/${id}`)
 }

  /**
  * 新增/修改子字典接口
  */
 export async function AddUpdateSubDict(data){
   return await $R_P.put("/smart_building/data/v1/dictionary_value/",  data)
 }
 /**
  * 查询子字典详情
  */
 export async function GetSubDictDetail({dictionaryId,pid}){
   return await $R_P.get(`/smart_building/data/v1/dictionary_value/${dictionaryId}/${pid}`)
 }
 /**
  *
  * 删除子字典
  */
 export async function deleSubDict({dictionaryId,pid}){
   return await $R_P.del(`/smart_building/data/v1/dictionary_value/${dictionaryId}/${pid}`)
 }
 