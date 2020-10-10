import { ElementBasic } from "@engine/layout-renderer/types";
import {
  Selector, TreeSelector, Table, Button, AllComponentType, FormInput
} from "./components";
import { CommonObjStruct } from "../public";
import { WidgetEvents } from "../events";

export type ComponentType = Selector | FormInput | TreeSelector | Table | Button
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
  actions?: WidgetEvents;

  /** UI隔离的唯一标示 */
  compType: AllComponentType; // TODO
  // schemasMapping: string;

  /** 静态的props或style */
  // staticProps?: CommonObjStruct;
  // staticStyle?: CommonObjStruct;

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
