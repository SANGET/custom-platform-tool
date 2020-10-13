/**
 * 组件类接入标准
 */

import { WidgetTypeMeta } from "./widget";

/**
 * 组件类集合
 */
export interface WidgetTypeMetadataCollection {
  [id: string]: WidgetTypeMeta
}
