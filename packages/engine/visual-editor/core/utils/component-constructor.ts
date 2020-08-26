/* eslint-disable no-param-reassign */
import produce from 'immer';
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
    idCount?: number
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
    idCount,
    extendEntityID = '',
    state = 'active'
  } = options;
  /** 外部可以通过 entityID 设置 componentClass id */
  let { entityID = '' } = componentClass;
  if (!entityID) {
    /** 如果外部没有传入，则通过生成器生成 ID */
    entityID = increaseID(idCount, ENTITY_ID);
  } else {
    entityID = extendEntityID;
  }

  /**
   * 如果组件还没被实例化，则实例化组件类
   *
   * 下划线前缀为内部字段，用于表示已经实例化
   */
  const entity = produce(componentClass, (draft) => {
    delete draft.bindProps;
    draft.id = entityID;
    draft._classID = componentClass.id;
    draft._state = state;
  });

  return entity;
};

export const constructTempEntity = (props = {}): TempEntity => ({
  ...props,
  id: increaseID(Math.random(), TEMP_ENTITY_ID),
  _state: TEMP_ENTITY_ID,
});

export const isTempEntity = (entity) => entity._state === TEMP_ENTITY_ID;
