import { INIT_APP, InitAppAction } from "../actions";
import { ComponentPanelConfig } from "../../types";

export interface PageMetadata {
  dataSource
  content
  /** 页面标准接口 */
  pageInterface
}

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export function pageMetadataReducer(
  state = {},
  action
) {
  switch (action.type) {
    default:
      return state;
  }
}

export interface AppContext {
  /** App 是否做好准备 */
  ready: boolean
  /** 组件类数据 */
  compClassData?: any
  /** 属性项数据 */
  propItemsData?: any
  /** 组件类面板数据 */
  compPanelData?: ComponentPanelConfig
  /** 页面可编辑属性数据 */
  pagePropsData?: any
}
/**
 * 整个应用的上下文数据
 */
export function appContextReducer(
  state = {
    ready: false
  },
  action: InitAppAction
): AppContext {
  switch (action.type) {
    case INIT_APP:
      const {
        compClassData, compPanelData,
        pagePropsData, propItemsData
      } = action;
      return {
        ready: true,
        compClassData,
        compPanelData,
        pagePropsData,
        propItemsData
      };
    default:
      return state;
  }
}
