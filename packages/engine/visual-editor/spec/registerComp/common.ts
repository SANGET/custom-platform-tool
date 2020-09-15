/**
 * @author zxj
 * 注册组件的地方，并且提供组件接入标准
 *
 * TODO: 放到前端动态资源管理服务中进行统一管理
 */

import { EditorEntityState } from "../../types";

export interface RegisterCompElementProps {
  compContext: {
    entityState: EditorEntityState
  }
}

export interface RegisterEditor extends RegisterCompElementProps {
  onChange: (nextValue: EditorEntityState) => void
}

/**
 * 可注册的 component
 */
export type RegistrableComponent = React.ElementType<RegisterCompElementProps>
export type RegistrablePropEditor = React.ElementType<RegisterEditor>

export interface RegisterComponentConfig {
  /** 组件的名字 */
  name: string
  /** 注册的具体组件 */
  comp: RegistrableComponent
  /** 特定的组件属性面板 */
  propEditor?: RegistrablePropEditor
}

/**
 * 注册的组件集合
 */
export interface RegisteredComponents {
  [type: string]: RegisterComponentConfig
}

const registeredComponents: RegisteredComponents = {};

/**
 * 获取已注册的组件
 * @param type
 */
export const getRegisteredComp = (compName: string) => {
  const comp = registeredComponents[compName];
  if (comp) {
    return comp;
  }
  throw Error(`发现尚未注册的组件类型 ${compName}，请检查是否注册成功`);
};

/**
 * 接入标准，接入单个组件
 */
export const registerComp = (
  /** 组件名称，对应组件类中的 component.type 属性 */
  compName: string,
  /** 接入的组件 */
  config: RegisterComponentConfig,
) => {
  // TODO: 检查是否符合标准
  if (registeredComponents[compName]) {
    console.error(`重复注册 ${compName}，请检查`);
    return false;
  }
  registeredComponents[compName] = config;
  return true;
};

/**
 * 接入标准，接入多个组件
 */
export const registerComps = (config: RegisteredComponents) => {
  // TODO: 检查是否符合标准，并且注册到
  for (const compName in config) {
    if (Object.prototype.hasOwnProperty.call(config, compName)) {
      const component = config[compName];
      registerComp(compName, component);
    }
  }
};
