import { EditorComponentClass } from "../../types";
import { increaseID, ENTITY_ID } from "./utils";

/**
 * 实例化 componentClass
 */
const instantiation = (componentClass, entityID) => {
  return Object.assign({}, componentClass, {
    id: entityID,

    /** 下划线前缀为内部字段，用于表示已经实例化 */
    /** 备份 classID */
    _classID: componentClass.id,
    /** 当前实例是激活的 */
    _state: 'active'
  });
};

/**
 * 封装操作 componentClass 的工厂方法
 */
export const stateOperatorFac = (state, setState) => {
  /**
   * 更新
   */
  const update = (id, targetEntity) => {
    const nextState = {
      ...state,
    };
    nextState[id] = targetEntity;
    setState(nextState);

    return nextState;
  };

  /**
   * 添加 state
   */
  const add = (componentClass: EditorComponentClass) => {
    /** 防止嵌套 */
    if (!!componentClass.id && componentClass.id === componentClass.parentID) return componentClass;

    /** 外部可以通过 entityID 设置真正的 entity 的 id */
    let { entityID } = componentClass;
    if (!entityID) {
      entityID = increaseID(ENTITY_ID);
    }
    /** 如果组件还没被实例化 */
    /** 实例化 */
    const entity = instantiation(componentClass, entityID);
    const nextState = {
      ...state,
      [entityID]: entity
    };

    setState(nextState);

    return entity;
  };

  /**
   * 删除
   */
  const del = (id) => {
    const nextState = {
      ...state,
    };
    delete nextState[id];
    setState(nextState);

    return nextState;
  };
  return {
    add,
    update,
    del,
  };
};
