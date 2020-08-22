import * as CanvasActions from './canvas';
import * as LayoutActions from './layout';
import * as EngityStateActions from './entity-state';

export * from './canvas';
export * from './layout';
export * from './entity-state';

/**
 * 操作画布的 actions
 */
export interface AppDispatcher {
  InitApp: typeof CanvasActions['InitApp']
  SelectEntity: typeof CanvasActions['SelectEntity']
}

/**
 * 操作实例状态的 actions
 */
export interface EngityStateDispatcher {
  InitEntityState: typeof EngityStateActions['InitEntityState']
  UpdateEntityState: typeof EngityStateActions['UpdateEntityState']
}

/**
 * 操作实例状态的 actions
 */
export interface LayoutDispatcher {
  SetLayoutInfo: typeof LayoutActions['SetLayoutInfo']
  SortingEntity: typeof LayoutActions['SortingEntity']
  DelEntity: typeof LayoutActions['DelEntity']
  MotifyEntity: typeof LayoutActions['MotifyEntity']
  AddEntity: typeof LayoutActions['AddEntity']
}

export interface Dispatcher extends AppDispatcher, EngityStateDispatcher, LayoutDispatcher{}
