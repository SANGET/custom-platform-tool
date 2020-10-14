import { API_SUCESS_CODE, NOTIFICATION_TYPE } from '@provider-app/table-info/constant';
import { openNotification, deleteConfirm } from '@provider-app/table-info/service';
import {
  getDictionaryListServices as getDictionaryListServicesApi,
  getListOfDictionaryChildServices as getListOfDictionaryChildServicesApi,
  getListOfDictionaryServices as getListOfDictionaryServicesApi,
  delChildOfDictionaryServices as delChildOfDictionaryServicesApi,
  delDictionaryServices as delDictionaryServicesApi,
  editDictionary as editDictionaryApi,
  postDictionary as postDictionaryApi,
  editChildOfDictionary as editChildOfDictionaryApi,
  moveChildOfDictionary as moveChildOfDictionaryApi
} from './apis';
import { MESSAGE } from '../constants';

export async function getDictionaryListServices(params) {
  const res = await getDictionaryListServicesApi(params);
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.GETDICTIONARYLIST_FAILED);
    return { data: [], total: 0 };
  }
  return res?.result;
}

export async function getListOfDictionaryServices({ id }) {
  const res = await getListOfDictionaryServicesApi({ id });
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.GETLISTOFDICTIONARY_FAILED);
    return [];
  }
  return res?.result?.items;
}
export async function getListOfDictionaryChildServices(param) {
  const res = await getListOfDictionaryChildServicesApi(param);
  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.GETLISTOFDICTIONARYCHILD_FAILED);
    return [];
  }
  return res?.result;
}
export const delChildOfDictionaryServices = (param) => {
  return new Promise((resolve, reject) => {
    deleteConfirm({
      onOk: async () => {
        const res = await delChildOfDictionaryServicesApi(param);
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
};
export const delDictionaryServices = (dictionaryId) => {
  return new Promise((resolve, reject) => {
    deleteConfirm({
      onOk: async () => {
        const res = await delDictionaryServicesApi(dictionaryId);
        if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
          openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.DELETEDICTIONARY_FAILED);
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
  const res = await postDictionaryApi(data);

  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.ADDDICTIONARY_FAILED);
    return false;
  }
  return true;
}
export async function editDictionary(data) {
  const res = await editDictionaryApi(data);

  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    // openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || '字典修改失败');
    return false;
  }
  return true;
}
export async function editChildOfDictionary(data) {
  const res = await editChildOfDictionaryApi(data);

  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.EDITCHILDOFDICTIONARY_FAILED);
    return false;
  }
  return true;
}
export async function moveChildOfDictionary(data) {
  const res = await moveChildOfDictionaryApi(data);

  if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
    openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || MESSAGE.MOVECHILD_FAILED);
    return false;
  }
  return true;
}
