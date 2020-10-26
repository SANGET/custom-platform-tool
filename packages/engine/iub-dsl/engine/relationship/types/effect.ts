import { DependInfo } from './depend';

/** TODO: 改善这些描述, 使其使用的时候可以知道, 如何写 */

/** 动作的触发类型 */
export enum TriggerType {
  tableUpdate = 'tableUpdate',
  tableSet = 'tableSet',
  tableDelete = 'tableDelete',
  userBehavior = 'userBehavior'
}

/** 动作的影响类型 */
export enum EffectType {
  tableSelect = 'tableSelect'
}

/** 影响的描述 */
/** 影响信息描述, 可以有多影响 */
interface EffectBaseInfo {
  /** 系统触发的XX动作而引起的副作用 */
  triggerType?: TriggerType;
  triggerInfo?: any;
  effectType?: EffectType;
  effectInfo?: any;
}

/**
 * 动作造成的影响的描述信息
 * 说明:
 *  1. 触发了有影响的操作达到了, 触发影响的可能
 *  2. 每个动作的描述信息都不一样
 *  3. 一个动作可以包含多个影响信息
 */
export interface ActionEffect extends EffectBaseInfo {
  actionId: string;
  actionType?: string;
}

interface EffectTypeOfTableSelect extends EffectBaseInfo {
  effectType: EffectType.tableSelect;
  /** 待完善 */
  effectInfo: {
    table: string;
  }
}

/**
 * apbdslCURD
 */
export type APBDSLActionEffect =
  ActionEffect & // 基础动作影响的描述
  EffectTypeOfTableSelect & // 触发表格选择影响的描述
  // APBDSL动作信息特有得描述
  {
    triggerInfo: {
      businesscode: string;
    }
  }

/**
 * 动作影响收集后的格式
 */
export interface ActionEffectCollection {
  [actionId: string]: APBDSLActionEffect

}
