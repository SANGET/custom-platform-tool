/**
 * @author zxj
 *
 * 应用的 action，需要留有足够的扩展空间
 */

import { BasePageData } from "../../types";

interface AppActionsContext {
  compPanelData
  propPanelData
  compClassDeclares
  propItemDeclares
  pagePropsData
  pageData: BasePageData
  options?: any
}

export const INIT_APP = 'app/init';
export interface InitAppAction extends AppActionsContext{
  type: typeof INIT_APP
}

/**
 * 初始化应用数据
 */
export const InitApp = (payload): InitAppAction => {
  return {
    type: INIT_APP,
    ...payload
  };
};

export interface UpdateAppAction extends AppActionsContext {
  type: typeof UPDATE_APP
}
export const UPDATE_APP = 'app/update';
/**
 * 更新 app context 数据
 */
export const UpdateAppContext = (payload): UpdateAppAction => {
  return {
    type: UPDATE_APP,
    ...payload,
  };
};

export const UNMOUNT_APP = 'app/unmount';
export interface UnmountAppAction {
  type: typeof UNMOUNT_APP
}

/**
 * 初始化应用数据
 */
export const UnmountApp = (): UnmountAppAction => {
  return {
    type: UNMOUNT_APP,
  };
};
