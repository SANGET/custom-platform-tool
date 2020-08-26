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
  compClassData
  propItemsData
  pagePropsData
  pageData: BasePageData
}

/**
 * 初始化应用数据
 */
export const InitApp = ({
  /** 组件类面板数据 */
  compPanelData,
  compClassData,
  propItemsData,
  pagePropsData,
  pageData,
}): InitAppAction => {
  return {
    type: INIT_APP,
    compPanelData,
    compClassData,
    propItemsData,
    pagePropsData,
    pageData,
  };
};
