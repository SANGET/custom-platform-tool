import { PropItemCompAccessSpec } from './interfaces';
import PropItemInput from './PropItems/Input';

/**
 * 获取属性项
 */
export const getPropItem = (propItemCompType: string): PropItemCompAccessSpec => {
  return new PropItemInput();
};
