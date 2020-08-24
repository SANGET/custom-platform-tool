import {
  ENTITY_ID,
  increaseID,
} from '@engine/visual-editor/utils';
import {
  EditorComponentClass, EditorComponentEntity, TempEntity, TEMP_ENTITY_ID
} from '../../types';

export type ConstructCompClass = (
  componentClass: EditorComponentClass,
  options?: {
    extendEntityID?: string
    state?: string
  }
) => EditorComponentEntity

/**
 * 实例化 componentClass
 */
export const constructCompClass: ConstructCompClass = (
  componentClass: EditorComponentClass,
  options = {}
) => {
  const {
    extendEntityID = '',
    state = 'active'
  } = options;
  /** 外部可以通过 entityID 设置 componentClass id */
  let { entityID = '' } = componentClass;
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
  const entity = Object.assign({}, componentClass, {
    id: entityID,
    /** 备份 classID */
    _classID: componentClass.id,
    /** 当前实例是激活的 */
    _state: state,
  });

  return entity;
};

export const constructTempEntity = (props = {}): TempEntity => ({
  ...props,
  id: increaseID(TEMP_ENTITY_ID),
  _state: TEMP_ENTITY_ID,
});

export const isTempEntity = (entity) => entity._state === TEMP_ENTITY_ID;
