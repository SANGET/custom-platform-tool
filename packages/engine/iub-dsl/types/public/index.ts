import { Condition } from "./condition";
import { WhenStruct } from "./when";

export type IdRefType = string;

export interface CommonObjStruct {
  [str: string]: any
}
export interface CommonCondition {
  condition?: Condition;
  when?: WhenStruct;
}

export * from './condition';
