import * as CanvasActions from './canvas';

export * from './canvas';

/**
 * 返回合成的 dispatcher 类型，提供给连接 redux 的组件使用
 */
export interface Dispatcher {
  InitApp: typeof CanvasActions['InitApp']
  SelectEntity: typeof CanvasActions['SelectEntity']
  InitEntityState: typeof CanvasActions['InitEntityState']
  UpdateEntityState: typeof CanvasActions['UpdateEntityState']
  SetLayoutInfo: typeof CanvasActions['SetLayoutInfo']
  DelEntity: typeof CanvasActions['DelEntity']
  MotifyEntity: typeof CanvasActions['MotifyEntity']
  AddEntity: typeof CanvasActions['AddEntity']
}
