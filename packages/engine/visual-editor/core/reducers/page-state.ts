import produce from 'immer';
import { mergeDeep } from '@infra/utils/tools';
import {
  INIT_APP, InitAppAction,
  ADD_ENTITY, AddEntityAction, UPDATE_APP, UpdateAppAction, ChangeMetadataAction, CHANGE_METADATA
} from "../actions";
import { PageMetadata } from "../../data-structure";

const DefaultPageMeta: PageMetadata = {
  lastCompID: 0,
  dataSource: {},
  pageInterface: {},
  linkpage: {},
  schema: {},
  actions: {},
};

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export function pageMetadataReducer(
  state: PageMetadata = DefaultPageMeta,
  action: InitAppAction | AddEntityAction | ChangeMetadataAction
) {
  switch (action.type) {
    case INIT_APP:
      const {
        pageContent
      } = action;
      return produce(pageContent, (draft) => (draft ? draft.meta : state));
    case ADD_ENTITY:
      return produce(state, (draft) => {
        draft.lastCompID += 1;
        return draft;
      });
    case CHANGE_METADATA:
      return produce(state, (draft) => {
        const { data, metaAttr, dataRefID } = action;
        if (!draft[metaAttr]) {
          console.error('尝试修改了不存在的 meta，请检查代码');
          draft[metaAttr] = {};
        }
        if (dataRefID) {
          draft[metaAttr][dataRefID] = data;
        } else {
          const newDataRefID = Object.keys(draft[metaAttr]).length + 1;
          Object.assign(draft[metaAttr], {
            [newDataRefID]: data
          });
        }
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
  widgetMetaDataCollection?: any
  /** 属性项数据 */
  propItemData?: any
  /** 组件类面板数据 */
  widgetPanelData?: any
  propItemGroupingData?: any
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
        widgetMetaDataCollection, widgetPanelData,
        propItemGroupingData,
        pagePropsData, propItemData,
        payload,
        name, id
      } = action;
      return {
        ready: true,
        payload,
        widgetMetaDataCollection,
        widgetPanelData,
        propItemGroupingData,
        pagePropsData,
        propItemData
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
