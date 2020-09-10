import { ElementBasic } from "@engine/layout-renderer/types";
import {
  Selector, TreeSelector, Table, Button, Input
} from "./components";
import { CommonObjStruct } from "../public";

/**
 * 1. 通过某种结构在解析的时候区分是否为静态
 * 2. 针对不同的类型进行采用不同增强器解析/运行
 * 3. UI接入的时候将统一的props, 转换成为真实组件使用的props
 */

/** 直接引用 action */
type ActionDirectType = {
  type: "direct";
  func: "Action";
};

/** 从 action collection 中引用 action */
type ActionRefType = {
  type: "actionRef";
  /** 引用的页面，如果没有，则代表当前页 */
  pageID?: string;
  /** 需要引用的组件 ID */
  actionID: string;
}

export type ActionTypes = ActionDirectType | ActionRefType;

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

export type ComponentType = Selector | Input | TreeSelector | Table | Button
/**
 * 组件元素，行为载体
 */
export interface ComponentElement extends ElementBasic {
  id: string;
  type: "component";
  /**
   * 用户操作触发的事件
   * TODO: 完善更多事件的定义
  */
  actions?: Events;

  /** UI隔离的唯一标示 */
  componentType: string | 'Input'; // TODO
  // schemasMapping: string;

  /** 静态的props或style */
  staticProps?: CommonObjStruct;
  staticStyle?: CommonObjStruct;

  // ! ⬆TODO:

  /** 对应配置的style */
  // style: {
  //   display: {
  //     type: 'codeControl',
  //     when: [],
  //     // condition: true,
  //     condition: {
  //       type: 'lowcode',
  //       expression: '',
  //       paramRes: [],
  //     },
  //     successValue: 'block',
  //     faildValue: 'none'
  //   }
  // };
  props?: any;
  // props: {
  //   rules: [
  //     {
  //       type: 'sysRule',
  //       rule: string;
  //       faileTips: string
  //     }
  //   ]
  // }
}
