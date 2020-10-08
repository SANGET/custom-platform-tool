// interface GetListResponse {
//   result: {
//     data: {
//       id:string
//       modifiedBy: string
//       gmtModified: number
//       name: string
//       code: string
//       description: string
//     }[]
//     total: number
//   }
// }
// type GetList = (params:{name?:string, description?:string, offset?:number, size?:number}) => Promise<GetListResponse>
import { API_SUCESS_CODE, NOTIFICATION_TYPE, API_ERROR_MSG } from '@provider-app/table-info/constant';
import { openNotification, deleteConfirm } from '@provider-app/table-info/service';

export async function getDictionaryListServices(params) {
  const res = await $R_P.get({
    url: '/data/v1/dictionary/list',
    params
  });
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '获取字典列表数据失败，，请联系技术人员');
    return { data: [], total: 0 };
  }
  return res?.result;
}

export async function getListOfDictionaryServices({ id }) {
  debugger;
  const res = await $R_P.get({
    url: `/data/v1/dictionary/${id}`
  });
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '获取字典详情数据失败，，请联系技术人员');
    return [];
  }
  return res?.result?.items;
}
export async function getListOfDictionaryChildServices({ pid, dictionaryId }) {
  const res = await $R_P.get({
    url: `/data/v1/dictionary_value/${dictionaryId}/${pid}`
  });
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '获取子字典详情数据失败，，请联系技术人员');
    return [];
  }
  return res?.result;
}
export async function delChildOfDictionaryServices({ pid, dictionaryId }) {
  return new Promise((resolve, reject) => {
    deleteConfirm({
      onOk: async () => {
        const res = await $R_P.del({
          url: `/data/v1/dictionary_value/${dictionaryId}/${pid}`,
        });
        if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
          // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '删除字典子项失败，请联系技术人员');
          resolve(false);
          return;
        }
        openNotification(NOTIFICATION_TYPE.SUCCESS, '字典子项删除成功！');
        resolve(true);
      },
      onCancel: () => {
        resolve(false);
      }
    });
  });
}
export const delDictionaryServices = (dictionaryId) => {
  return new Promise((resolve, reject) => {
    deleteConfirm({
      onOk: async () => {
        const res = await $R_P.del({
          url: `/data/v1/tables/${dictionaryId}`,
        });
        if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
          // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '删除字典失败，请联系技术人员');
          resolve(false);
          return;
        }
        openNotification(NOTIFICATION_TYPE.SUCCESS, '字典删除成功！');
        resolve(true);
      },
      onCancel: () => {
        resolve(false);
      }
    });
  });
};
