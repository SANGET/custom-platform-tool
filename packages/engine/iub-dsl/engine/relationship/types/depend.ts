/**
 * 依赖的描述信息
 */
export interface DependInfo {
  /** 真实值获取引用的路径 */
  refValue: string;
  /** 处理的模块 */
  // refModel: string;
  /** 处理的函数 */
  // refMethod: string;

  /** 原始收集的路径信息 */
  jsonPath?: string;
  jsonKey?: string;
}

/**
 * 动作的依赖
 * 1. schemas 页面运行时状态的依赖, get/set
 * 2. metadata 元数据的依赖, get 「set, 万一需要更新元数据呢?」
 * 3. 路径是否可以标示为动作的子依赖
 * TODO: 额外数据处理? 还不够抽象??
 */
export interface ActionDepend {
  actionId: string;
  /** 使用了哪些页面数据 */
  schemasToUse?: DependInfo[];
  /** set不是依赖是影响 */
  // schemasSet?: DependInfo[];
  /** 使用了哪些元数据 */
  metadataToUse?: DependInfo[];
  /** 该动作被哪个flowItem使用了 */
  flowUsed?: string[];
}

/**
 * props的依赖
 * 1. schemas 页面运行时状态的依赖, get
 * 2. metadata 元数据的依赖, get
 */
export interface PropsDepend {
  compMark?: string;
  schemasGet?: DependInfo[];
  metadataGet?: DependInfo[];
}

/**
 * 收集后的格式
 */
export type ActionDependCollection = ActionDepend[]

export interface PropsDependCollection {
  [compMark: string]: PropsDepend
}
