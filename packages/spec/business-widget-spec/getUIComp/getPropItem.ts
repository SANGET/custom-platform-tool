import { getUICompHOC } from './getUIComp';
import { PropItemCompAccessSpec } from '../interfaces';
import * as PropItems from '../PropItems';

/**
 * 获取属性项 UI 组件实例
 */
export const getPropItem = getUICompHOC<PropItemCompAccessSpec>(PropItems);
