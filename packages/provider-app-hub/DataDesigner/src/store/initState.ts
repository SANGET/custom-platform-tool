/*
 * @Author: your name
 * @Date: 2020-08-03 12:22:24
 * @LastEditTime: 2020-08-24 17:15:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataManager\src\store\index.ts
 */
/** 分页类型定义 */
export interface IPager {
  page: number;
  pageSize: number;
}

/** 共享状态数据类型定义 */
export interface IState {
  /** 加载动画 */
  isShowLoading:boolean;
  /** 表结构分页对象 */
  structPager:IPager;
  /** 树源数据 */
  treeData:Array<unknown>;
  structTableData:Array<unknown>;
  structRowData:unknown;
  structTableEnum:Array<{text:string, value:string}>
}

/** 共享数据初始值 */
export const defaultState = {
  isShowLoading: false,
  structPager: {
    page: 1,
    pageSize: 10,
  },
  treeData: [],
  structTableData: [],
  structRowData: {
    name: "",
    code: "",
    type: "",
    moduleId: "",
    moduleName: "",
    species: "BIS",
    labels: null,
    description: "",
    gmtCreate: "",
    modifiedBy: null,
    gmtModified: "",
    auxTable: {},
    treeTable: null,
    sql_view: null,
    relation_tables: [],
    columns: [],
    references: [],
    foreignKeys: [],
    combo_uniques: null,
    indexes: null,
    table_join_factor: null
  },
  structTableEnum: [],
};

/** 动作集合 */
export type Action =
  | {
    type: 'triggerStructPager'
    structPager: IPager;
  }
  | {
    type: 'setTreeData'
    treeData: Array<unknown>;
  }
  | {
    type: 'setStructTableData'
    structTableData: Array<unknown>;
  }
  | {
    type: 'setStructRowData'
    structRowData: unknown;
  }
  | {
    type: 'setStructTableEnum'
    structTableEnum: Array<{text:string, value:string}>;
  }
  | {
    type: 'triggerLoading'
    isShowLoading: boolean;
  };
