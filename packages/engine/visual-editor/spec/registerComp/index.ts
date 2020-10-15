import {
  registerComp, getRegisteredComp,
  RegisterComponentConfig
} from "./common";

export * from './common';

/** 组件类 */
const CompClassType = '_comp_c_';

/** 属性项 */
const PropItemMeta = '_prop_i_';

/** 特定编辑器 */
const EditorCompType = '_editor_c_';

/**
 * 包装组件名
 */
const wrapCompName = (prefix: string, name: string) => `${prefix}${name}`;

/**
 * 批量注册组件的 HOC
 */
const batchRegister = (prefix: string) => {
  return (compConfig: RegisterComponentConfig[]) => {
    for (const config of compConfig) {
      const { name } = config;
      const _compName = wrapCompName(prefix, name);
      registerComp(_compName, config);
    }
  };
};

/**
 * 获取组件的 HOC
 */
const getCompHOC = (prefix: string) => {
  return (compName: string) => {
    return getRegisteredComp(wrapCompName(prefix, compName));
  };
};

/**
 * 获取组件实例的具体实现
 */
export const getCompEntity = getCompHOC(CompClassType);

/**
 * 获取组件类
 */
export const getPropItem = getCompHOC(PropItemMeta);

/**
 * 获取组件类
 */
export const getPropEditor = getCompHOC(EditorCompType);

/**
 * 注册组件类
 */
export const registerCompClass = batchRegister(CompClassType);

/**
 * 注册属性项
 */
export const registerPropItem = batchRegister(PropItemMeta);

/**
 * 注册属性项
 */
export const registerEditor = batchRegister(EditorCompType);
