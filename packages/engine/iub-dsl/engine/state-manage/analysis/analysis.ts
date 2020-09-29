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
  Schemas, FoundationTypeSchemas, ComplexType, ComplexTypeSchemas
} from "@iub-dsl/definition";
import { structScheduler, ParseBaseOptions } from "../parser/struct-scheduler";
import { SchemasAnalysisRes, SchemasAnalysisExtralCtx, SchemasAnalysisCtx } from "./i-analysis";
import { SCHEMAS_DEFAULT_KEY, PATH_SPLIT_MARK_ARR, PATH_SPLIT_MARK } from "../const";

const addLevelRelation = ({ parentPath, levelRelation, key }) => {
  const pPaath = parentPath || 'top';
  (levelRelation[pPaath] || (levelRelation[pPaath] = [])).push(key);
};

/**
 * 基础数据类型对应的分析
 */
const foundationAnalysis = ({
  pathMapInfo,
  levelRelation,
  baseStruct,
}: SchemasAnalysisRes, {
  parentPath, key, schemaItem
}: SchemasAnalysisCtx<FoundationTypeSchemas>) => {
  /** 路径映射信息添加 */
  pathMapInfo[parentPath + key] = {
    ...schemaItem,
    [SCHEMAS_DEFAULT_KEY]: key,
    parentPath
  };
  /** 等级关系构建 */
  addLevelRelation({ parentPath, key, levelRelation });
};

const complexAnalysis = ({
  pathMapInfo,
  levelRelation,
  baseStruct
}: SchemasAnalysisRes, {
  parentPath, key, schemaItem: { struct, type },
}: SchemasAnalysisCtx<ComplexTypeSchemas>) => {
  /** 公共逻辑新的父级path */
  let newParentPath = parentPath + key;

  /** 路径映射信息添加 */
  pathMapInfo[newParentPath] = {
    structType: type,
    [SCHEMAS_DEFAULT_KEY]: key,
    parentPath
  };

  /** 等级关系构建 */
  addLevelRelation({ parentPath, key, levelRelation });

  /** 公共逻辑添加新父级的后缀 */
  newParentPath += (
    type === ComplexType.structArray ? PATH_SPLIT_MARK_ARR : PATH_SPLIT_MARK
  );

  return newParentPath;
};

const treeAnalysis = () => {};

/** 分析结果的模型 */
const initAnalysis = (): SchemasAnalysisRes => {
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
 * 使用调度器分析数据模型 -> 得出分析结果
 * @param originSchemas 原始的页面数据模型
 */
const schemasAnalysis = (originSchemas: Schemas): SchemasAnalysisRes => {
  /** 分析结果的模型 */
  const schemasAnalysisRes = initAnalysis();
  // TODO: 类型问题
  const parseContext: ParseBaseOptions & SchemasAnalysisExtralCtx = {
    /** TODO: 名词 */
    foundationParser: (ctx: SchemasAnalysisCtx<FoundationTypeSchemas>) => {
      /** 基础数据类型分析 */
      foundationAnalysis(schemasAnalysisRes, ctx);

      parseContext.tempStruct[ctx.key] = ''; // 上下文临时结构赋值
    },
    complexStructParser: (ctx: SchemasAnalysisCtx<ComplexTypeSchemas>) => {
      /** 赋值数据类型得分析 */
      const newParentPath = complexAnalysis(schemasAnalysisRes, ctx);
      parseContext.parentPath = newParentPath;

      /**
       * 注意区分情况:
       * 1. 递归: 赋值给上文的结构
       * 2. 非递归: 赋值给最外层结构
       * 3. 上下文区分: 全局上下文, 递归内部上下文
       */
      parseContext.tempStruct = {}; // 上下文临时结构赋值
      schemasAnalysisRes.baseStruct[newParentPath] = parseContext.tempStruct;

      /** 递归 */
      structScheduler(ctx.schemaItem.struct, parseContext);
    },
    parentPath: '',
    tempStruct: schemasAnalysisRes.baseStruct
  };
  structScheduler(originSchemas, parseContext);
  return schemasAnalysisRes;
};

export default schemasAnalysis;
