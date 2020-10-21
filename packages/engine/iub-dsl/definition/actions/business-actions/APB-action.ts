import { NormalCURD } from './CURD';
import { BasicActionConf } from '../action';

export type APBDSLCURDActionType = 'APBDSLCURD';

export interface APBDSLCURD extends BasicActionConf {
  actionType: APBDSLCURDActionType;
  actionOptions: {
    /** apb业务功能码「小的」 */
    businesscode: string;
    /** apbAction列表 */
    actionList: {
      [id: string]: NormalCURD
    }
    /** apbstep执行步骤 */
    actionStep: string[];
  }
  actionOutput: 'string';
}

/** APB的功能码 */
export enum ApbFunction {
  /** 插入 */
  SET = 'TABLE_INSERT',
  /** 更新 */
  UPD = 'TABLE_UPDATE',
  /** 删除 */
  DEL = 'TABLE_DELETE',
  /** 查表 */
  SELECT = 'TABLE_SELECT',
  /** 上传 */
  UPLOAD = 'UPLOAD',
  /** 下载 */
  DOWN = 'DOWNLOAD',
  /** 导入 */
  IMPORT = 'IMPORT_DATA',
  /** 导出 */
  EXPORT = 'EXPORT_TO_FILE',
  /** 自定义返回 */
  RESULT = 'RESULT_RESOLVER'
  /** 第三方业务... 扩展自定义的 */
}

/** APB 的条件标志符 */
export enum ConditionSymbol {
  OR = 'or',
  AND = 'and'
}

/** APB 的条件操作符 */
export enum ConditionOperator {
  EQU = 'equ', // =
  N_EQU = 'not_equ', // <>
  GERATER = 'gerater', // >
  LESS = 'less', // <
  GERATER_EQU = 'gerater_equ', // =>
  LESS_EQU = 'less_equ', // <=
  BETWEEN = 'between',
  N_BETTWEEN = 'not_between',
  LIKE = 'like',
  N_LIKE = 'not_like',
  IN = 'in',
  N_IN = 'not_in',
  EMPTY = 'empty',
  N_EMPTY = 'not_empty',
  S_WITH = 'start_with',
  S_N_WITH = 'start_not_with'
}
