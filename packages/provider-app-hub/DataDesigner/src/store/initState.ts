/*
 * @Author: your name
 * @Date: 2020-08-03 12:22:24
 * @LastEditTime: 2020-08-26 14:28:45
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
  /** 表结构-编辑-- 行记录详情  */
  structRowData:unknown;
  /** 表结构-编辑-- 引用表 外键设置 关联表字段下拉枚举  */
  structTableEnum:Array<{text:string, value:string}>
  /** 表结构-编辑--表字段列表 是否过滤掉类型为系统的行记录 */
  sysFieldCtrl:{isShow:boolean, title:string}
}

/** 共享数据初始值 */
export const defaultState = {
  /** 全局http请求动画 */
  isShowLoading: false,
  /** 表结构后端不返回行记录的序号,需要前端用分页值计算 */
  structPager: {
    page: 1,
    pageSize: 10,
  },
  /** 菜单树,在选择归属模块,根据菜单查询页面所使用的数据表的场景用 */
  treeData: [],
  /** 表结构行记录编辑提交数据,表字段,关联表,引用表分散在多个组件中,各组件要将各自的修改最终汇总到表结构行记录详情对象 */
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
    AUX_TABLE: {},
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
  /** 关联表下拉枚举,用于生成表结构-新建表  表结构-编辑-引用表|外键设置--关联表下拉选项数据 */
  structTableEnum: [],
  /** 表结构-编辑-表字段 是否过滤掉行记录 系统类型的记录 */
  sysFieldCtrl: { isShow: false, title: '显示' }
};

/** 动作集合 */
export type Action =
  | {
    type: 'setStructPager'
    structPager: IPager;
  }
  | {
    type: 'setTreeData'
    treeData: Array<unknown>;
  }
  | {
    type: 'setStructRowData'
    structRowData: unknown;
  }
  | {
    type: 'setSysFieldCtrl'
    sysFieldCtrl:{isShow:boolean, title:string}
  }
  | {
    type: 'setStructTableEnum'
    structTableEnum: Array<{text:string, value:string}>;
  }
  | {
    type: 'setLoading'
    isShowLoading: boolean;
  };
