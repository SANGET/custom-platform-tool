/**
 * 属性项接入标准
 */

import { PropItemCompAccessSpec, PropItemMeta } from "./prop-item";
import { WidgetEntity } from "./widget";

/**
 * 返回属性项的函数接入方式
 */
export type PropItemConfig = (entity: WidgetEntity) => PropItemMeta

/**
 * 属性项集合
 */
export interface PropItemsCollection {
  [colID: string]: PropItemCompAccessSpec
}
