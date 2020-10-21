import { CommonCondition, ComplexType } from "..";
import {
  UpdateState, FeedBack, DataCollection, DataCollectionActionType, UpdateStateActionType
} from "./sys-actions";
import { APBDSLCURD, APBDSLCURDActionType } from './business-actions';

/**
 * @extends CommonCondition 控制动作能否执行的条件
 */
export interface BasicActionConf extends CommonCondition {
  /** 动作Id */
  actionId: string;
  /** 动作名字 */
  actionName: string;
  /** 动作的类型 */
  actionType: AllActionType;
  /** 不同动作的配置 */
  actionOptions: any;
  /** 单个动作的输出, TODO: 实际如何使用 */
  actionOutput: ActionOutput;
}

type SysActionType =
  DataCollectionActionType |
  UpdateStateActionType;

type BusinessActionType =
  APBDSLCURDActionType

type AllActionType = SysActionType | BusinessActionType
export type ActionsDefinition = UpdateState | DataCollection | APBDSLCURD | {
  actionType: 'showMoadl';
  actionOptions?: any;
  actionName: string
  actionOutput?: any;
  actionId: string;
}

export type ActionOutput = 'string' | 'boolean' | 'undefined' | 'number' | FlowOutputOfObj;

export interface FlowOutputOfObj {
  type: ComplexType;
  struct: {from: string; to: string}[]
}

export interface ActionCollection {
  [actionId: string]: ActionsDefinition
}
