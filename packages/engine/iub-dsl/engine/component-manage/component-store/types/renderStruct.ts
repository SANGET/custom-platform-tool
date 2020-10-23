import { AllUI } from "../../UI-factory/types/all-UI";
/**
 * 解析的目的
 * 1. 解析组件
 *  1. 获取所有有效的propsKey
 *  2. 分组每个组件使用的props
 *  3. 根据完整结构, 生成可以渲染的结构
 * 2. 扩展点
 *  1. 扩展外部干预
 */

/** 公共渲染信息的定义 */
interface PubRenderStructInfo {
  compTag: AllUI;
  // compTag: string;
  canSkip: boolean;
  canUseProps: string[];
  canUseGroupProps?: string[];
}

/** 子渲染结构 */
interface ChildrenStruct {
  children?: FullRenderStruct[]
}

/** 基础渲染结构 */
type BaseRenderStruct = {
  type: 'BaseRenderStruct',
  requireRender?: boolean
} & PubRenderStructInfo

/** 同一层渲染的结构 */
type ArrayRenderStruct = {
  type: 'ArrayRenderStruct',
  canUseCompList: PubRenderStructInfo[];
  isloop: boolean;
}

/** 所有可以渲染的结构 */
type FullRenderStruct = (BaseRenderStruct | ArrayRenderStruct) & ChildrenStruct

type RenderStructInfo = {
  mark: string;
  childrenStructInfo: RenderStructInfo[]
}

export type RenderCompInfoItem = {
  compTag: AllUI;
  mark: string;
  // TODO: types
  dynamicProps: {
    [propsKey: string]: any
  };
  staticProps: {
    [propsKey: string]: any
  }
}
type RenderCompInfo = {
  [mark: string]: RenderCompInfoItem
}

interface CommonRenderStructParser {
  allConfKey: string[]
  originConf: any;
  baseMark: string;
}

interface GenRenderStructContext {
  allConfKey: string[];
  originConf: any;
  baseMark: string;
  index: number;
  renderStructInfo: RenderStructInfo[];
  renderCompInfo: RenderCompInfo
}

export {
  BaseRenderStruct,
  ArrayRenderStruct,
  FullRenderStruct,
  // ActualRenderInfo,
  GenRenderStructContext,
  CommonRenderStructParser,
  RenderStructInfo,
  RenderCompInfo
};

/**
 * 背景:
 * 1. IUB-DSL组件描述信息数据结构恒定
 * 2. 而实际的组件渲染的结构, 根据不同的配置, 不同的ui组件库, 不同端都是不一样的
 * 存在目的/意义:
 * 1. 转换成真实组件渲染结构的桥梁
 * 2. 将配置中的props正确赋予真实渲染的组件
 * 问题:
 * 1. 参数配置的扩展
 * 2. 职能范围外的扩展「如, 条件处理, 状态管理」
 * 3. 复杂结构的扩展
 * 依赖:
 * 1. 生成渲染的结构
 * 2. 对应的结构解析和渲染
 */
