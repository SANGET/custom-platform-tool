import { RE } from '@provider-app/table-structure/constant';
import { ISpecies } from './interface';

export { RE };
export enum TABLE_TYPE {
  /** 普通表 */
  "TABLE" = "TABLE",
  /** 树形表 */
  "TREE" = "TREE",
  /** 附属表 */
  "AUX_TABLE" = "AUX_TABLE"
}

export enum TABLE_TYPE_CN {
  /** 普通表 */
  "TABLE" = "普通表",
  /** 树形表 */
  "TREE" = "树形表",
  /** 附属表 */
  "AUX_TABLE" = "附属表"
}

export enum NOTIFICATION_TYPE {
  /** 成功 */
  "SUCCESS" = "success",
  /** 提示 */
  "INFO" = "info",
  /** 提醒 */
  "WARNING" = "warning",
  /** 失败 */
  "ERROR" = "error"
}

export enum API_SUCESS_CODE {
  /** 查表详情成功的 code 值 */
  "GETTABLEINFO" = "00000"
}

export enum API_ERROR_MSG {
  /** 查表详情失败的提示信息 */
  "GETTABLEINFO" = "查询表数据失败，请联系技术人员",
  "ALLOWDELETE" = "查询删除绑定情况失败，请联系技术人员"
}

export enum MENUS_TYPE {
  /** 模块 */
  "MODULE",
  /** 页面 */
  "PAGE"
}

export enum DESCRIPTION_SIZE {
  "SMALL" = "s"
}

export enum BUTTON_TYPE {
  "PRIMARY" = "primary"
}

export enum BUTTON_SIZE {
  "LARGE" = "large",
  "MIDDLE" = "middle",
  "SMALL" = "small"
}

export const SPECIES = {
  /** 系统元数据 */
  SYS: ISpecies.SYS,
  /** 业务元数据 */
  BIS: ISpecies.BIS,
  /** 系统元数据 */
  SYS_TMPL: ISpecies.SYS_TMPL,
  /** 业务元数据 */
  BIS_TMPL: ISpecies.BIS_TMPL
};

export const DATATYPESTR = 'dataType';
export const FIELDCODE = 'fieldCode';
export const QUOTE = 'QUOTE';
