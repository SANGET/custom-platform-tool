import produce from 'immer';
import {
  INIT_APP, InitAppAction,
  ADD_ENTITY, AddEntityAction
} from "../actions";
import { ComponentPanelConfig, PageMetadata } from "../../types";

const DefaultPageMeta: PageMetadata = {
  lastCompID: 0,
  dataSource: {},
  pageInterface: {}
};

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export function pageMetadataReducer(
  state: PageMetadata = DefaultPageMeta,
  action: InitAppAction | AddEntityAction
) {
  switch (action.type) {
    case INIT_APP:
      const {
        pageData
      } = action;
      return produce(pageData, (draft) => (draft ? draft.meta : state));
    case ADD_ENTITY:
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft.lastCompID += 1;
        return draft;
      });
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
