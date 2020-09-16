import produce from 'immer';
import { mergeDeep } from '@infra/utils/tools';
import {
  INIT_APP, InitAppAction,
  ADD_ENTITY, AddEntityAction, UPDATE_APP, UpdateAppAction
} from "../actions";
import { PageMetadata } from "../../types";

const DefaultPageMeta: PageMetadata = {
  lastCompID: 0,
  dataSource: {},
  pageInterface: {},
  linkpage: {},
  name: ''
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
  /** 存放所有组件的数据 */
  /** 组件类数据 */
  compClassDeclares?: any
  /** 属性项数据 */
  propItemDeclares?: any
  /** 组件类面板数据 */
  compPanelData?: any
  propPanelData?: any
  /** 页面可编辑属性数据 */
  pagePropsData?: any
  /** 页面元数据 */
  payload?: any
}
/**
 * 整个应用的上下文数据
 */
export function appContextReducer(
  state = {
    ready: false
  },
  action: InitAppAction | UpdateAppAction
): AppContext {
  switch (action.type) {
    case INIT_APP:
      const {
        compClassDeclares, compPanelData,
        propPanelData,
        pagePropsData, propItemDeclares,
        payload,
        name, id
      } = action;
      return {
        ready: true,
        payload,
        compClassDeclares,
        compPanelData,
        propPanelData,
        pagePropsData,
        propItemDeclares
      };
    case UPDATE_APP:
      const { type, ...otherState } = action;
      return produce(state, (draftState) => {
        // Object.assign(draftState, otherState);
        const nextStateVal = mergeDeep(draftState, otherState);
        return nextStateVal;
      });
    default:
      return state;
  }
}
