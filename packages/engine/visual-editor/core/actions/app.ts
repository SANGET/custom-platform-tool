/**
 * @author zxj
 *
 * 应用的 action，需要留有足够的扩展空间
 */

import { BasePageData } from "../../types";

export const INIT_APP = 'app/init';
export interface InitAppAction {
  type: typeof INIT_APP
  compPanelData
  compClassDeclares
  propItemDeclares
  pagePropsData
  pageData: BasePageData
  options?: any
}

/**
 * 初始化应用数据
 */
export const InitApp = ({
  /** 组件类面板数据 */
  compPanelData,
  compClassDeclares,
  propItemDeclares,
  pagePropsData,
  pageData,
  options = {}
}): InitAppAction => {
  return {
    type: INIT_APP,
    compPanelData,
    compClassDeclares,
    propItemDeclares,
    pagePropsData,
    pageData,
    options,
  };
};

export const UNMOUNT_APP = 'app/unmount';
export interface UnmountAppAction {
  type: typeof UNMOUNT_APP
}

/**
 * 初始化应用数据
 */
export const UnmountApp = (): InitAppAction => {
  return {
    type: UNMOUNT_APP,
  };
};
