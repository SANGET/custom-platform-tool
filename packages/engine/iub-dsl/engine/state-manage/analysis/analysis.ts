import {
  Schemas, FoundationTypeSchemas, ComplexType, ComplexTypeSchemas, FoundationType, SchemaItem
} from "@iub-dsl/definition";
import { SchemasAnalysisRes, SchemasAnalysisCommonFn, SchemaItemAnalysisCtx } from "./i-analysis";
import { SCHEMAS_DEFAULT_KEY, PATH_SPLIT_MARK_ARR, PATH_SPLIT_MARK } from "../const";

/** 分析结果的数据结构模型 */
const initAnalysisRes = (): SchemasAnalysisRes => {
  const pathMapInfo = {};
  const levelRelation = {};
  const baseStruct = {};

  return {
    pathMapInfo,
    levelRelation,
    baseStruct,
  };
};

/**
 * 生成解析的上下文
 * @param schemaBasePath schema的基础路径
 * @param schemaItem schema每一项的信息
 * @param parentPath 递归: 父级路径
 */
const genAnalysisCtx = (
  schemaBasePath, schemaItem, parentPath = ''
): SchemaItemAnalysisCtx => ({
  schemaBasePath,
  parentPath,
  schemaPath: parentPath + schemaBasePath,
  schemaItem,
});

/**
 * 调度对应的解析器解析
 * @param schemaItemAnalysisCtx 解析的标准上下文
 * @param schemasAnalysisRes 解析返回的结果
 */
const schemasAnalysisScheduler: SchemasAnalysisCommonFn = (
  schemaItemAnalysisCtx,
  schemasAnalysisRes
) => {
  const { schemaItem } = schemaItemAnalysisCtx;
  switch (schemaItem.type) {
    case ComplexType.structObject:
    case ComplexType.structArray:
      complexAnalysis(
        schemaItemAnalysisCtx as SchemaItemAnalysisCtx<ComplexTypeSchemas>,
        schemasAnalysisRes
      );
      break;
    case FoundationType.boolean:
    case FoundationType.number:
    case FoundationType.string:
    default:
      foundationAnalysis(
        schemaItemAnalysisCtx as SchemaItemAnalysisCtx<FoundationTypeSchemas>,
        schemasAnalysisRes
      );
      break;
  }
};

/**
 * 基础类型schemaItemInfo的解析
 * @param schemaItemAnalysisCtx 解析的标准上下文
 * @param schemasAnalysisRes 解析返回的结果
 */
const foundationAnalysis: SchemasAnalysisCommonFn<FoundationTypeSchemas> = (schemaItemAnalysisCtx, schemasAnalysisRes) => {
  const {
    schemaBasePath, schemaPath,
    schemaItem, parentPath
  } = schemaItemAnalysisCtx;
  const { pathMapInfo, baseStruct } = schemasAnalysisRes;

  /** 路径映射信息添加 */
  pathMapInfo[schemaPath] = {
    ...schemaItem,
    [SCHEMAS_DEFAULT_KEY]: schemaBasePath,
    parentPath
  };

  /** 结构的构建 */
  baseStruct[schemaBasePath] = schemaItem.defaultVal || ''; // 上下文临时结构赋值
};

/**
 * 复杂类型schemaItemInfo的解析
 * @param schemaItemAnalysisCtx 解析的标准上下文
 * @param schemasAnalysisRes 解析返回的结果
 */
const complexAnalysis: SchemasAnalysisCommonFn<ComplexTypeSchemas> = (schemaItemAnalysisCtx, schemasAnalysisRes) => {
  const {
    schemaBasePath, schemaPath,
    schemaItem: { struct, type }, parentPath,
  } = schemaItemAnalysisCtx;
  const { pathMapInfo, baseStruct } = schemasAnalysisRes;
  const parentMark = (
    type === ComplexType.structArray ? PATH_SPLIT_MARK_ARR : PATH_SPLIT_MARK
  );

  /** 路径映射信息添加 */
  pathMapInfo[schemaPath] = {
    structType: type,
    [SCHEMAS_DEFAULT_KEY]: schemaBasePath,
    parentPath
  };

  /** 递归结构的构建 */
  const { baseStruct: subBaseStruct } = schemasStructAnalysis(struct, {
    parentPath: schemaPath + parentMark,
  }, schemasAnalysisRes);

  baseStruct[schemaBasePath] = subBaseStruct;
};

/**
 * schemas结构分析
 * @param schemas Schemas
 * @param option { parentPath: '递归: 父级的路径' }
 * @param schemasAnalysisRes 每一级的返回结果
 */
const schemasStructAnalysis = (
  schemas: Schemas,
  { parentPath }: { parentPath: string },
  schemasAnalysisRes = initAnalysisRes(),
  // schemasAnalysisRes: SchemasAnalysisRes
): SchemasAnalysisRes => {
  const schemasPaths = Object.keys(schemas);
  const analysisRes = {
    ...schemasAnalysisRes,
    baseStruct: {}
  };
  /** 等级关系构建 */
  analysisRes.levelRelation[parentPath || 'top'] = schemasPaths;

  for (let i = 0; i < schemasPaths.length; i++) {
    const schemaBasePath = schemasPaths[i];
    const analysisCtx = genAnalysisCtx(
      schemaBasePath,
      schemas[schemaBasePath],
      parentPath
    );
    schemasAnalysisScheduler(analysisCtx, analysisRes);
  }
  return analysisRes;
};

/**
 * 使用调度器分析数据模型 -> 得出分析结果
 * @param originSchemas 原始的页面数据模型
 */
const schemasAnalysis = (
  originSchemas: Schemas
) => {
  const options = {
    parentPath: '',
  };
  return schemasStructAnalysis(originSchemas, options);
};

export default schemasAnalysis;
