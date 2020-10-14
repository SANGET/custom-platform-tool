/**
 * CURD
 * @description 对应原型上的库表操作
*/
import { DataCollection } from "..";

export enum EnumCURD {
  TableInsert = 'TableInsert',
  TableUpdate = 'TableUpdate'
}

type fieldMapping = DataCollection // | string

interface BaseTableInfo {
  table: string;
}

export interface TableInsert extends BaseTableInfo {
  type: EnumCURD.TableInsert;
  fieldMapping: fieldMapping;
}

export interface TableUpdate extends BaseTableInfo {
  type: EnumCURD.TableUpdate;
  fieldMapping: fieldMapping;
  conditionConf: string;
}

export type NormalCURD = TableInsert | TableUpdate
