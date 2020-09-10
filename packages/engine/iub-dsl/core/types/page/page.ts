import PageMetadata from '@spec/page-metadata';

import {
  ComponentElement,
} from "../component";
import SRCInterface from "./src-interface";
import RelationshipsCollection from "../relationship/relationship-collection";
import { ActionFn } from "../actions/action-collection";
import { Schemas } from "../schemas";
import { LayoutContent } from "../layout-content";
import { MetadataMappingCollection } from "..";

/**
 * 描述页面信息的 DSL
 *
 * TODO: 增加依赖校验
 */
export interface TypeOfIUBDSL extends PageMetadata {
  /** 与 system runtime context 的接口 */
  sysRtCxtInterface: SRCInterface;

  /** Schema 数据模型 */
  schemas: Schemas;

  /**
   * 数据源关系枢纽
   *
   * 规则：
   * 1. 子模版的 dataSourceHub 需要合并到最高层，
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
    // [actionID: string]: ActionFlow;
    [actionID: string]: ActionFn;
  };

  /** 布局信息 */
  layoutContent: LayoutContent;
}
