import {
  FoundationTypeSchemas, CommonObjStruct, ComplexTypeSchemas, AllType, SchemaItem
} from "@iub-dsl/definition";
import { SCHEMAS_DEFAULT_KEY, SCHEMAS_DEFAULT_KEY_TYPE } from "../const";

export interface SchemasAnalysisRes {
  pathMapInfo: {
    // [str: string]: PathMapInfoItem,
    [str: string]: any,
  },
  levelRelation: {
    [str: string]: string[];
  },
  baseStruct: CommonObjStruct
}

export interface SchemaItemAnalysisCtx<T extends SchemaItem = SchemaItem> {
  schemaBasePath: string;
  parentPath: string;
  schemaPath: string;
  schemaItem: T
}

export interface SchemasAnalysisCommonFn<T extends SchemaItem = SchemaItem, R = void> {
  (
    schemaItemAnalysisCtx: SchemaItemAnalysisCtx<T>,
    schemasAnalysisRes: SchemasAnalysisRes
  ): R
}

/** schemas模型映射数据所有key */
type PathMapInfoKeys = Exclude<keyof FoundationTypeSchemas, 'type'> | SCHEMAS_DEFAULT_KEY_TYPE | 'parentPath'
/** schemas模型映射数据y */
export type PathMapInfoItem = {
  [K in PathMapInfoKeys]: string;
} & {
  type: AllType;
};
