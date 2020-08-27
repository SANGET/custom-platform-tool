/**
 * @author zxj
 * 注册组件的地方，并且提供组件接入标准
 *
 * TODO: 放到前端动态资源管理服务中进行统一管理
 */

import { BasicComponent } from "@infra/ui/basic";

export interface RegisterCompElementProps extends BasicComponent {
  /** 占位符，防止被 eslint 删除 */
  temp?
}

type ComponentEntity = React.ElementType<RegisterCompElementProps>

/**
 * 组件接入标准的定义
 */
export type RegisterComp = (
  /** 组件类型，对应组件类中的 component.type */
  compType: string,
  /** 接入的组件 */
  Comp: ComponentEntity
) => boolean

interface RegisteredComponents {
  [type: string]: ComponentEntity
}

const registeredComponents: RegisteredComponents = {};

export const getComp = (type: string) => {
  const comp = registeredComponents[type];
  if (comp) {
    return comp;
  }
  console.error(`发现尚未注册的组件类型 ${type}，请检查是否注册成功`);
  return 'div';
};

/**
 * 接入标准，接入单个组件
 */
export const registerComp: RegisterComp = (compType, Comp) => {
  // TODO: 检查是否符合标准，并且注册到
  registeredComponents[compType] = Comp;
  return true;
};

/**
 * 接入标准，接入多个组件
 */
export const registerComps = (config: RegisteredComponents) => {
  // TODO: 检查是否符合标准，并且注册到
  for (const compType in config) {
    if (Object.prototype.hasOwnProperty.call(config, compType)) {
      const component = config[compType];
      registerComp(compType, component);
    }
  }
};
