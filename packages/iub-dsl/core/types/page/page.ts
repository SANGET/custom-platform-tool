import { ContainerElement } from "../layout-content/container";
import { ComponentElementRefType, ComponentElement } from "../component/collection";
import SRCInterface from "./src-interface";
import MetadataMappingCollection from "../metadata/metadata-mapping-collection";
import RelationshipsCollection from "../relationship/relationship-collection";
import { ActionFlow } from "../actions/action-collection";
import { PageSchemas, FlowSchemas } from "../schemas";

type ElementType = ContainerElement | ComponentElementRefType;

/** 页面内容 */
type LayoutContentGeneral = {
  /** 页面内容类型 */
  type: 'general';
  /** 子内容 */
  content: ElementType[];
}

/** 页面内容 */
type LayoutContentCustom = {
  /** 页面内容类型 */
  type: 'custom';
  /** 子内容 */
  content: () => any;
}

/**
 * 页面类型详细定义
 */
type PageTypes =
/** 通过配置生成 */
'config' |
/** 嵌入页面 */
'embed';

/**
 * 描述页面信息的 DSL
 *
 * 规则：一级属性存储描述页面的信息
 */
export interface TypeOfIUBDSL {
  /**
   * 页面 ID，用于给其他页面引用
   * TODO: 创建页面时需要获取
   */
  id: string;

  /** 页面类型 */
  type: PageTypes;

  /** 页面名称 */
  name: string;

  /** 与 system runtime context 的接口 */
  sysRtCxtInterface: SRCInterface;

  /** Schema 数据模型 */
  schemas: {
    page: PageSchemas;
    flow: FlowSchemas;
  },

  /**
   * 元数据映射集合 [数据源关系枢纽]
   */
  metadataCollection: MetadataMappingCollection;

  /** 关系集合 */
  relationshipsCollection: RelationshipsCollection;

  /** 组件集合 */
  componentsCollection: {
    [componentID: string]: ComponentElement;
  };

  /** 动作集合 */
  actionsCollection: {
    [actionID: string]: ActionFlow;
  };

  /** 布局信息 */
  layoutContent: LayoutContentGeneral | LayoutContentCustom;
}
