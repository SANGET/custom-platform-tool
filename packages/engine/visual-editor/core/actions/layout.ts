import {
  EditorComponentEntity
} from "../../types";

/**
 * 添加组件实例
 */
export const ADD_ENTITY = 'entity/add';
export interface AddEntityAction {
  type: typeof ADD_ENTITY
  entity: EditorComponentEntity
  idx: number
}

export const AddEntity = (
  entity: EditorComponentEntity,
  idx
): AddEntityAction => {
  return {
    type: ADD_ENTITY,
    entity,
    idx
  };
};

/**
 * 更改组件实例
 */
export const MOTIFY_ENTITY = 'entity/motify';
export interface MotifyEntityAction {
  type: typeof MOTIFY_ENTITY
  entity: EditorComponentEntity
}

export const MotifyEntity = (
  entity: EditorComponentEntity
): MotifyEntityAction => {
  return {
    type: MOTIFY_ENTITY,
    entity
  };
};

/**
 * 删除组件实例
 */
export const DEL_ENTITY = 'entity/del';
export interface DelEntityAction {
  type: typeof DEL_ENTITY
  entityIdx: number
}

export const DelEntity = (
  entityIdx: number
): DelEntityAction => {
  return {
    type: DEL_ENTITY,
    entityIdx
  };
};

/**
 * 设置 layout info 的值
 */
export const SORTING_ENTITY = 'entity/sorting';
export interface SortingEntityAction {
  type: typeof SORTING_ENTITY
  /** 拖动的元素的 index */
  dragIndex: number
  /** 拖动的元素移动到了的 index */
  hoverIndex: number
  entity
  /**
   * 记录嵌套信息
   *
   * 例如 [0] 代表最外层的第 0 个元素中进行排序
   * 例如 [0, 1, 2] 代表最外层第 0 个元素中的第 1 个元素中的第 2 个元素
   */
  nestingInfo?: number[]
  replace?: boolean
}

export const SortingEntity = (
  /** 拖起的项的 index */
  dragIndex: number,
  /** 拖起的项移动到的 index */
  hoverIndex: number,
  /** 拖起的 entity */
  entity,
  /** 选项 */
  options?: {
    /** 嵌套信息 */
    nestingInfo?: number[],
    /** 是否替换在 hoverIndex 的 entity */
    replace?: boolean
  },
): SortingEntityAction => {
  return {
    type: SORTING_ENTITY,
    dragIndex,
    hoverIndex,
    entity,
    ...options,
  };
};

/**
 * 设置 layout info 的值
 */
export const SET_LAYOUT_STATE = 'layout/state/set';
export interface SetLayoutAction {
  type: typeof SET_LAYOUT_STATE
  state
}

export const SetLayoutInfo = (
  state
): SetLayoutAction => {
  return {
    type: SET_LAYOUT_STATE,
    state
  };
};
