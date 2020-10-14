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
import { MESSAGE } from '../constants';

export async function getDictionaryListServices(params) {
  const res = await $R_P.get({
    url: '/data/v1/dictionary/list',
    params
  });
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.GETDICTIONARYLIST_FAILED);
    return { data: [], total: 0 };
  }
  return res?.result;
}

export async function getListOfDictionaryServices({ id }) {
  const res = await $R_P.get({
    url: `/data/v1/dictionary/${id}`
  });
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.GETLISTOFDICTIONARY_FAILED);
    return [];
  }
  return res?.result?.items;
}
export async function getListOfDictionaryChildServices({ pid, dictionaryId }) {
  const res = await $R_P.get({
    url: `/data/v1/dictionary_value/${dictionaryId}/${pid}`
  });
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.GETLISTOFDICTIONARYCHILD_FAILED);
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
        openNotification(NOTIFICATION_TYPE.SUCCESS, MESSAGE.DELETECHILDOFDICTIONARY_SUCCESS);
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
        openNotification(NOTIFICATION_TYPE.SUCCESS, MESSAGE.DELETEDICTIONARY_SUCCESS);
        resolve(true);
      },
      onCancel: () => {
        resolve(false);
      }
    });
  });
};

export async function postDictionary(data) {
  const res = await $R_P.post('/data/v1/dictionary/', data);

  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '字典新增失败');
    return false;
  }
  return true;
}
export async function editDictionary(data) {
  const res = await $R_P.put('/data/v1/dictionary/', data);

  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '字典修改失败');
    return false;
  }
  return true;
}
export async function editChildOfDictionary(data) {
  const res = await $R_P.put('/data/v1/dictionary_value/', data);

  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '配置子项失败');
    return false;
  }
  return true;
}
export async function moveChildOfDictionary(data) {
  const res = await $R_P.put('/data/v1/dictionary_value/move', data);

  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.MOVECHILD_FAILED);
    return false;
  }
  return true;
}
