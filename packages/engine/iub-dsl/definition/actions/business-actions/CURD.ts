import { CommonCondition } from '@iub-dsl/definition/public/index';
/**
 * CURD
 * @description 对应原型上的库表操作
*/
import { DataCollection } from "..";

export enum EnumCURD {
  TableInsert = 'TableInsert',
  TableUpdate = 'TableUpdate',
  TableSelect = 'TableSelect',
  TableDelete = 'TableDelete',
}

type fieldMapping = DataCollection // | string

interface BaseTableInfo {
  table: string;
}

export interface TableInsert extends BaseTableInfo {
  type: EnumCURD.TableInsert;
  fieldMapping: fieldMapping;
}

export interface TableUpdate extends BaseTableInfo, CommonCondition {
  type: EnumCURD.TableUpdate;
  fieldMapping: fieldMapping;
}

export interface TableSelect extends BaseTableInfo, CommonCondition {
  type: EnumCURD.TableSelect;
}

export interface TableDelete extends BaseTableInfo, CommonCondition {
  type: EnumCURD.TableDelete;
}

export type NormalCURD = TableInsert | TableUpdate | TableSelect | TableDelete
