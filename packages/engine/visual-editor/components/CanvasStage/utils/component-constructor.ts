import {
  ENTITY_ID,
  increaseID
} from '@engine/visual-editor/utils';
import { EditorComponentClass } from '../../../types';

/**
 * 实例化 componentClass
 */
export const constructCompClass = (
  componentClass: EditorComponentClass,
  extendEntityID?: string
) => {
  /** 外部可以通过 entityID 设置 componentClass id */
  let { entityID } = componentClass;
  if (!entityID) {
    /** 如果外部没有传入，则通过生成器生成 ID */
    entityID = increaseID(ENTITY_ID);
  } else {
    entityID = extendEntityID;
  }

  /**
   * 如果组件还没被实例化，则实例化组件类
   *
   * 下划线前缀为内部字段，用于表示已经实例化
   */
  return Object.assign({}, componentClass, {
    id: entityID,
    /** 备份 classID */
    _classID: componentClass.id,
    /** 当前实例是激活的 */
    _state: 'active'
  });
};
