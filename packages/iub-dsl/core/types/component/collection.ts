import { ElementAST } from "../layout-content/element";
import {
  Selector, TreeSelector, Table, Button, Input
} from "./components";
import { Action } from "../actions/action-collection";

/** 直接引用 action */
type ActionDirectType = {
  type: 'direct';
  func: Action;
};

/** 从 action collection 中引用 action */
type ActionRefType = {
  type: 'actionRef';
  /** 引用的页面，如果没有，则代表当前页 */
  pageID?: string;
  /** 需要引用的组件 ID */
  actionID: string;
}

type ActionTypes = ActionDirectType | ActionRefType;

interface Events {
  onMount?: ActionTypes;
  onUnmount?: ActionTypes;
  /** 鼠标点击 */
  onClick?: ActionTypes;
  /** 移动端手势处罚 */
  onTap?: ActionTypes;
  /** 值改变时的回调 */
  onChange?: ActionTypes;
  /** 获取焦点时的回调 */
  onFocus?: ActionTypes;
}

/**
 * 组件元素，行为载体
 */
export interface ComponentElement extends ElementAST {
  id: string;
  type: 'component';
  /**
   * 对应的 component
   * TODO: 完善所有 component 的 mapping
   */
  component: Selector | Input | TreeSelector | Table | Button;
  /** 存储通用 props 编辑后生成的数据 */
  props?: {
    /** 支持部分通用样式 */
    style?: {};
  };
  /**
   * 用户操作触发的事件
   * TODO: 完善更多事件的定义
   */
  actions?: Events;
  // actions?: {
  //   /** 鼠标点击 */
  //   onClick?: ActionTypes;
  //   /** 移动端手势处罚 */
  //   onTap?: ActionTypes;
  //   /** 值改变时的回调 */
  //   onChange?: ActionTypes;
  //   /** 获取焦点时的回调 */
  //   onFocus?: ActionTypes;
  // };
}

/**
 * 从 component collection 中引用组件
 */
export type ComponentElementRefType = {
  id: string;
  type: 'componentRef';
  /** 引用的页面，如果没有，则代表当前页 */
  pageID?: string;
  /** 需要引用的组件 ID */
  componentID: string;
}
