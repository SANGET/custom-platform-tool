/* eslint-disable no-param-reassign */
/**
 * 数据规则分析方向
 * 0. 基础规则: 描述、标签「对外通信标准」、别名
 * 1. 普通字段描述规则: 引用的数据库字段
 * 2. 复杂字段描述规则[Array/Object]: 引用库、引用的数据库字段、*嵌套引用
 * 3. 树形描述关系: 引用的重复结构 [目前仅考虑数组型的递归]
 *
 * 数据规则分析结果
 * 1. 所有路径
 * 2. 路径对应必要的描述
 * 3. 等级关系描述
 * 4. 如何初始化的结构描述
 *
 * 编码流程
 * 1. 结构调度器
 */

import {
  Schemas, FoundationTypeSchemas, ComplexType, ComplexTypeSchemas, FoundationType
} from "@iub-dsl/definition";
import { structScheduler, ParseBaseOptions } from "../parser/struct-scheduler";
import { SchemasAnalysisRes, SchemasAnalysisExtralCtx, SchemasAnalysisCtx } from "./i-analysis";
import { SCHEMAS_DEFAULT_KEY, PATH_SPLIT_MARK_ARR, PATH_SPLIT_MARK } from "../const";

// const addLevelRelation = ({ parentPath, levelRelation, schemaBasePath }) => {
//   const pPaath = parentPath || 'top';
//   (levelRelation[pPaath] || (levelRelation[pPaath] = [])).push(schemaBasePath);
// };
const addLevelRelation = (schemasPaths, { parentPath }, { levelRelation }) => {
  levelRelation[parentPath || 'top'] = schemasPaths;
};

/**
 * 基础数据类型对应的分析
 */
const foundationAnalysis = (schemasAnalysisCtx, schemasAnalysisRes) => {
  const {
    schemaBasePath, schemaItem, parentPath, tempBaseStruct
  } = schemasAnalysisCtx;
  const { pathMapInfo, levelRelation, baseStruct } = schemasAnalysisRes;
  /** 路径映射信息添加 */
  pathMapInfo[parentPath + schemaBasePath] = {
    ...schemaItem,
    [SCHEMAS_DEFAULT_KEY]: schemaBasePath,
    parentPath
  };

  tempBaseStruct[schemaBasePath] = schemaItem.defaultVal || ''; // 上下文临时结构赋值
};

const complexAnalysis = (schemasAnalysisCtx, schemasAnalysisRes) => {
  const {
    schemaBasePath, schemaItem: { struct, type }, parentPath,
    tempBaseStruct
  } = schemasAnalysisCtx;
  const { pathMapInfo, levelRelation } = schemasAnalysisRes;
  /** 公共逻辑新的父级path */
  let newParentPath = parentPath + schemaBasePath;

  /** 路径映射信息添加 */
  pathMapInfo[newParentPath] = {
    structType: type,
    [SCHEMAS_DEFAULT_KEY]: schemaBasePath,
    parentPath
  };

  /** 公共逻辑添加新父级的后缀 */
  newParentPath += (
    type === ComplexType.structArray ? PATH_SPLIT_MARK_ARR : PATH_SPLIT_MARK
  );

  /** 递归 */
  // const newTempBaseStruct = {};
  // tempBaseStruct[schemaBasePath] = newTempBaseStruct;
  // schemasAnalysisCtx.tempBaseStruct = newTempBaseStruct;
  schemasAnalysisCtx.parentPath = newParentPath;
  schemasAnalysisCtx.schemaItem = struct;
  a(schemasAnalysisCtx, schemasAnalysisRes);
};

const treeAnalysis = () => {};

/** 分析结果的模型 */
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

const schemasAnalysisScheduler = (schemasAnalysisCtx, schemasAnalysisRes) => {
  const { schemaItem } = schemasAnalysisCtx;
  switch (schemaItem.type) {
    case ComplexType.structObject:
    case ComplexType.structArray:
      return complexAnalysis(schemasAnalysisCtx, schemasAnalysisRes);
    case FoundationType.boolean:
    case FoundationType.number:
    case FoundationType.string:
    default:
      return foundationAnalysis(schemasAnalysisCtx, schemasAnalysisRes);
  }
};

const schemasAnalysisL = (schemasAnalysisCtx, schemasAnalysisRes) => {
  const { schemaItem, tempBaseStruct, parentPath } = schemasAnalysisCtx;
  const schemasPaths = Object.keys(schemaItem);
  // schemasAnalysisCtx.schemasPaths = schemasPaths;
  // addLevelRelation(schemasPaths, schemasAnalysisCtx, schemasAnalysisRes);

  for (let i = 0; i < schemasPaths.length; i++) {
    const schemaBasePath = schemasPaths[i];
    schemasAnalysisCtx.schemaItem = schemaItem[schemaBasePath];
    schemasAnalysisCtx.schemaBasePath = schemaBasePath;
    schemasAnalysisScheduler(schemasAnalysisCtx, schemasAnalysisRes);
    // schemasAnalysisCtx.tempBaseStruct = tempBaseStruct;
    // schemasAnalysisCtx.parentPath = parentPath;
  }
  return schemasAnalysisRes;
};

const a = (schemasAnalysisCtx, schemasAnalysisRes = {
  baseStruct: {}
}) => {
  const { schemaBasePath } = schemasAnalysisCtx;
  const {
    baseStruct
  } = schemasAnalysisRes;

  const r = schemasAnalysisL(schemasAnalysisCtx, schemasAnalysisRes);

  baseStruct[schemaBasePath] = r.baseStruct;

  return schemasAnalysisRes;
};

/**
 * 使用调度器分析数据模型 -> 得出分析结果
 * @param originSchemas 原始的页面数据模型
 */
const schemasAnalysis = (originSchemas: Schemas) => {
  console.log(originSchemas);

  /** 分析结果的模型 */
  const schemasAnalysisRes = initAnalysisRes();
  const c = {
    schemaItem: originSchemas,
    schemaBasePath: '',
    parentPath: '',
    tempBaseStruct: schemasAnalysisRes.baseStruct
  };
  return a(c, schemasAnalysisRes);

  // schemasAnalysisL(c, schemasAnalysisRes);

  // return schemasAnalysisRes;
};

export default schemasAnalysis;
