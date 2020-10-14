import {
  getTableInfo as getTableInfoApi,
  getTableList as getTableListApi,
  getDictionaryList as getDictionaryListApi,
  getMenuListService as getMenuListServiceApi,
  allowedDeleted as allowedDeletedApi,
  editTableInfo as editTableInfoApi
} from './apis';
import { API_CODE, NOTIFICATION_TYPE, MESSAGES } from './constants';
import { openNotification } from './service';
/** 查询表详情 */
export async function getTableInfo(id:string) {
  const res = await getTableInfoApi(id);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLEINFO_FAILED);
    return {};
  }
  return res?.result;
}
/** 查询模块列表 */
export async function getMenuListService(params) {
  const res = await getMenuListServiceApi(params);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETMENULIST_FAILED);
    return [];
  }
  return res?.result;
}
/* 查询字典列表 */
export async function getDictionaryList(params) {
  const res = await getDictionaryListApi(params);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETDICTIONARYLIST_FAILED);
    return { data: [], total: 0 };
  }
  return res?.result;
}
/** 查询表列表 */
export async function getTableList() {
  const res = await getTableListApi();
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.GETTABLELIST_FAILED);
    return [];
  }
  return res?.result?.data;
}

/* 判断是否可删除 */
export async function allowedDeleted(params) {
  const res = await allowedDeletedApi(params);
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

/** 保存表数据 */
export async function editTableInfo(data) {
  const res = await editTableInfoApi(data);
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGES.EDITTABLEINFO_FAILED);
    return false;
  }
  openNotification(NOTIFICATION_TYPE.SUCCESS, MESSAGES.EDITTABLEINFO_SUCCESS);
  return true;
}
