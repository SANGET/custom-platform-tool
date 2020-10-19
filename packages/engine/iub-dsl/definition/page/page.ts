import PageMetadata from '@spec/page-metadata';

import {
  ComponentElement,
} from "../component";
import SRCInterface from "./src-interface";
import RelationshipsCollection from "../relationship/relationship-collection";
import { ActionCollection } from "../actions/action";
import { FlowCollection } from '../flow';
import { Schemas } from "../schemas";
import { LayoutContent } from "../layout";
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
  actionsCollection: ActionCollection;
  /** 流程集合 */
  flowCollection: FlowCollection;

  /** 布局信息 */
  layoutContent: LayoutContent;
}
