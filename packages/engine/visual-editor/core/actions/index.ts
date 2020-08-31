import * as AppActions from './app';
import * as CanvasActions from './canvas';
import * as EntityStateActions from './entity-state';

export * from './app';
export * from './canvas';
export * from './entity-state';

export const AllDispatcherActions = {
  ...AppActions,
  ...CanvasActions,
  ...EntityStateActions,
};

export {
  AppActions,
  CanvasActions,
  EntityStateActions,
};

/**
 * 操作画布的 actions
 */
export interface AppDispatcher {
  InitApp: typeof AppActions['InitApp']
  UnmountApp: typeof AppActions['UnmountApp']
}

/**
 * 操作实例状态的 actions
 */
export interface EntityStateDispatcher {
  InitEntityState: typeof EntityStateActions['InitEntityState']
  UpdateEntityState: typeof EntityStateActions['UpdateEntityState']
}

/**
 * 操作实例状态的 actions
 */
export interface CanvasDispatcher {
  SetLayoutInfo: typeof CanvasActions['SetLayoutInfo']
  SortingEntity: typeof CanvasActions['SortingEntity']
  DelEntity: typeof CanvasActions['DelEntity']
  AddEntity: typeof CanvasActions['AddEntity']
  SelectEntity: typeof CanvasActions['SelectEntity']
}

export interface Dispatcher extends AppDispatcher, EntityStateDispatcher, CanvasDispatcher{}
