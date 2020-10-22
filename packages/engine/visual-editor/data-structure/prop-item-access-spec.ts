/**
 * 属性项接入标准
 */

import { PropItemMeta } from "./prop-item";
import { WidgetEntity } from "./widget";

/**
 * 属性项接入方法的上下文
 */
export interface PropItemCompAccessSpecCtx {
  entity: WidgetEntity
}

/**
 * 属性项的组件的接入标准
 */
export type PropItemCompAccessSpec = PropItemMeta
// export type PropItemCompAccessSpec = (propItemCompAccessSpecCtx: PropItemCompAccessSpecCtx) => PropItemMeta

/**
 * 属性项集合
 */
export interface PropItemsCollection {
  [colID: string]: PropItemCompAccessSpec
}
