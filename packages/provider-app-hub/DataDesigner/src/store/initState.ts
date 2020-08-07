/*
 * @Author: your name
 * @Date: 2020-08-03 12:22:24
 * @LastEditTime: 2020-08-06 16:02:25
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
}

/** 共享数据初始值 */
export const defaultState = {
  isShowLoading: false,
  structPager: {
    page: 1,
    pageSize: 10,
  },
  treeData: []
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
    type: 'triggerLoading'
    isShowLoading: boolean;
  };
