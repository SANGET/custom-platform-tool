import {
  FoundationTypeSchemas, CommonObjStruct, ComplexTypeSchemas, AllType
} from "@iub-dsl/definition";
import { SCHEMAS_DEFAULT_KEY, SCHEMAS_DEFAULT_KEY_TYPE } from "../const";
import { BaseSchedulerCtx } from "../parser/struct-scheduler";

export interface ExtralPathMapInfo {
  [SCHEMAS_DEFAULT_KEY]: string;
  parentPath: string
}
export interface SchemasAnalysisRes {
  pathMapInfo: {
    [str: string]: PathMapInfoItem,
  },
  levelRelation: {
    [str: string]: string[];
  },
  baseStruct: CommonObjStruct
}

/**
 * 分析使用的额外上下文
 */
export interface SchemasAnalysisExtralCtx {
  parentPath: string;
  tempStruct: { [str: string]: string };
}
export type SchemasAnalysisCtx<
  T = FoundationTypeSchemas | ComplexTypeSchemas
> = SchemasAnalysisExtralCtx & BaseSchedulerCtx<T>

/** schemas模型映射数据所有key */
type PathMapInfoKeys = Exclude<keyof FoundationTypeSchemas, 'type'> | SCHEMAS_DEFAULT_KEY_TYPE | 'parentPath'
/** schemas模型映射数据y */
export type PathMapInfoItem = {
  [K in PathMapInfoKeys]: string;
} & {
  type: AllType;
};
