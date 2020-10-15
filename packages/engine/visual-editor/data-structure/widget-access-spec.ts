/**
 * 组件类接入标准
 */

import { WidgetMetadata } from "./widget";

/**
 * 组件类集合
 */
export interface WidgetTypeMetadataCollection {
  [id: string]: WidgetMetadata
}
