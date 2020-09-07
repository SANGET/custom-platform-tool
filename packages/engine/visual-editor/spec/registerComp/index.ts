import { registerComp, getRegisteredComp, RegistrableComponent } from "./common";

export * from './common';

const CompClassType = '_comp_c_';
const PropItemType = '_prop_i_';

export interface RegisterComponentConfig {
  /** 组件的名字 */
  name: string
  /** 注册的具体组件 */
  comp: RegistrableComponent
}

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
      const { name, comp } = config;
      const _compName = wrapCompName(prefix, name);
      registerComp(_compName, comp);
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
export const getPropItem = getCompHOC(PropItemType);

/**
 * 注册组件类
 */
export const registerCompClass = batchRegister(CompClassType);

/**
 * 注册属性项
 */
export const registerPropItem = batchRegister(PropItemType);
