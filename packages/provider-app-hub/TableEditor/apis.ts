import { API_CODE, NOTIFICATION_TYPE } from './constants';
import { openNotification } from './service';
/** 查询表详情 */
export async function getTableInfo(id:string) {
  const res = await $R_P.get({
    url: `/data/v1/tables/${id}`,
    params: {},
  });
  /** 接口有误则返回提示 */
  if (res?.code !== API_CODE.SUCCESS) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '查询表数据失败，请联系技术人员');
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
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '查询模块列表数据失败，请联系技术人员');
    return [];
  }
  return res?.result;
}
