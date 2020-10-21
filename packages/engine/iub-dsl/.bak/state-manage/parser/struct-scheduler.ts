import {
  Schemas, SchemaItem, ComplexType, FoundationType
} from "@iub-dsl/definition";

export interface ExtralPathMapInfo {
  [SCHEMAS_DEFAULT_KEY]: string;
  parentPath: string
}
/**
 * 分析使用的额外上下文
 */
export interface SchemasAnalysisExtralCtx {
  parentPath: string;
  tempStruct: { [str: string]: any };
}
export type SchemasAnalysisCtx<
  T = FoundationTypeSchemas | ComplexTypeSchemas
> = SchemasAnalysisExtralCtx & BaseSchedulerCtx<T>

// TODO: 类型问题
// const parseContext: ParseBaseOptions & SchemasAnalysisExtralCtx = {
//   /** TODO: 名词 */
//   foundationParser: (ctx: SchemasAnalysisCtx<FoundationTypeSchemas>) => {
//     /** 基础数据类型分析 */
//     foundationAnalysis(schemasAnalysisRes, ctx);

//     parseContext.tempStruct[ctx.key] = ctx.schemaItem.defaultVal || ''; // 上下文临时结构赋值
//   },
//   complexStructParser: (ctx: SchemasAnalysisCtx<ComplexTypeSchemas>) => {
//     /** 赋值数据类型得分析 */
//     const newParentPath = complexAnalysis(schemasAnalysisRes, ctx);
//     parseContext.parentPath = newParentPath;

//     /**
//      * 注意区分情况:
//      * 1. 递归: 赋值给上文的结构
//      * 2. 非递归: 赋值给最外层结构
//      * 3. 上下文区分: 全局上下文, 递归内部上下文
//      */
//     parseContext.tempStruct = {}; // 上下文临时结构赋值
//     schemasAnalysisRes.baseStruct[newParentPath] = parseContext.tempStruct;

//     /** 递归 */
//     structScheduler(ctx.schemaItem.struct, parseContext);
//   },
//   parentPath: '',
//   tempStruct: schemasAnalysisRes.baseStruct
// };
// structScheduler(originSchemas, parseContext);

/**
 * 基础解析时上下文
 */
export interface BaseSchedulerCtx<T> {
  schemas: Schemas;
  schemaItem: T;
  key: string
}

/** 调度器默认的选项 */
export interface ParseBaseOptions<R = unknown> {
  foundationParser: (ctx) => R,
  complexStructParser: (ctx) => R,
}

/**
 * 针对固定的schemas结构调度解析器进行解析
 * @param schemas Schemas
 * @param param1 { foundationParser: 基本元素结构解析器, complexStructParser: 复杂结构解析器 }
 * @emits 发送/暴露所有内部数据
 * @returns async parseResult
 *  <T>(s: Schemas, { foundationParser, complexStructParser }) => Promise<T>
 *  otherparam是外部给到的ctx, 而2个parser是内部需要的param, 如果这样想第二个参数就是ctx
 */

export const structScheduler = <T>(schemas: Schemas, {
  foundationParser,
  complexStructParser,
  ...otherParams
  // ? 外部泛型传入有问题
}: ParseBaseOptions<any> & T) => {
  const schemasKeys = Object.keys(schemas);
  let schemaItem: SchemaItem;
  return schemasKeys.map((key) => {
    schemaItem = schemas[key];
    switch (schemaItem.type) {
      case ComplexType.structObject:
      case ComplexType.structArray:
        return complexStructParser({
          schemaItem, schemas, key, ...otherParams
        });
      case FoundationType.boolean:
      case FoundationType.number:
      case FoundationType.string:
      default:
        return foundationParser({
          schemaItem, schemas, key, ...otherParams
        });
    }
  });
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
