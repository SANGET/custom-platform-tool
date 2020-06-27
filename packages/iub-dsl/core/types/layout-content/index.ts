import { ContainerElement } from "./container";
import {
  ComponentElementRefType,
} from "../component/collection";

export type LayoutContentElement = ContainerElement | ComponentElementRefType;

/** 页面内容 */
export type LayoutContentGeneral = {
  /** 页面内容类型 */
  type: "general";
  /** 子内容 */
  content: LayoutContentElement[];
};

/** 页面内容 */
type LayoutContentCustom = {
  /** 页面内容类型 */
  type: "custom";
  /** 子内容 */
  content: () => any;
};

export type LayoutContent = LayoutContentGeneral | LayoutContentCustom
