export enum API_CODE {
  /** 查表详情成功的 code 值 */
  "SUCCESS" = "00000"
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

export const TABLE_TYPE_OPTIONS = [
  { label: '普通表', value: 'TABLE', key: 'TABLE' },
  { label: '附属表', value: 'AUX_TABLE', key: 'AUX_TABLE' },
  { label: '树形表', value: 'TREE', key: 'TREE' }
];
export enum TABLE_TYPE {
  /** 普通表 */
  "TABLE" = "TABLE",
  /** 树形表 */
  "TREE" = "TREE",
  /** 附属表 */
  "AUX_TABLE" = "AUX_TABLE"
}

export enum MENUS_TYPE {
  /** 模块 */
  "MODULE",
  /** 页面 */
  "PAGE"
}
