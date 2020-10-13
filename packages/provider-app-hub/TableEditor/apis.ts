import { API_CODE, NOTIFICATION_TYPE, MESSAGES } from './constants';
import { openNotification } from './service';
/** 查询表详情 */
export async function getTableInfo(id:string) {
  const res = await $R_P.get({
    url: `/data/v1/tables/${id}`,
    params: {},
  });
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return {};
  }
  return res?.result;
}
/** 查询模块列表 */
export async function queryMenusListService(params) {
  const res = await $R_P.get({
    url: `/page/v1/menus/list`,
    params
  });
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETMENULIST_FAILED);
    return [];
  }
  return res?.result;
}
/* 查询字典列表 */
export async function GetDictionaryList(params) {
  const res = await $R_P.get({
    url: '/data/v1/dictionary/list',
    params
  });
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETDICTIONARYLIST_FAILED);
    return { data: [], total: 0 };
  }
  return res?.result;
}
/** 查询表列表 */
export async function getTableList() {
  const res = await $R_P.get({
    url: `/data/v1/tables/list`,
  });
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLELIST_FAILED);
    return [];
  }
  return res?.result?.data;
}

/* 判断是否可删除 */
export async function allowedDeleted(params) {
  const { tableId, columnId } = params || {};
  const res = await $R_P.get({
    url: `/data/v1/tables/column/allowedDeleted/${tableId}/${columnId}`,
    params
  });
  const { code, result } = res || {};
  if (code !== API_CODE.SUCCESS) {
    /** 如果接口没有提供提示信息 */
    if (result?.length === 0) {
      return [MESSAGES.DELETEFIELD_FAILED];
    }
    return result;
  }
  return [];
}
