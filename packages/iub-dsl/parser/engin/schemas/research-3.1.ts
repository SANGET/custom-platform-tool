/* eslint-disable no-param-reassign */
import {
  Schemas, SchemaItem,
  FoundationTypeSchemas,
  StructTypeSchemas,
  CommonObjStruct,
  StructType, FoundationType
} from "@iub-dsl/core";
import { Enhancer } from "../utils/enhancer";
import { complexStructParserMiddleware, foundationParserMiddleware } from "./test-middleware";
import {
  FiledKey, DefaultParserCollection, GenerateParseResult, DefaultSchemasParserContext
} from "./i-schemas-parser";

const defaultCtxFn = (ctx) => ctx;

/**
 * 生成内部默认字段解析器
 */
const defaultFieldParser = (key: string) => (schemaItem: FoundationTypeSchemas) => (schemaItem[key] !== undefined ? schemaItem[key] : '');
const defaultParserKey: FiledKey[] = ['type', 'defaultVal', 'fieldMapping'];
const defaultParserCollection = defaultParserKey.reduce((parser, key) => {
  parser[key] = defaultFieldParser(key);
  return parser;
}, {} as Record<FiledKey, DefaultParserCollection>);

/**
 * 针对固定的schemas结构调度解析器进行解析
 * @param schemas Schemas
 * @param param1 { foundationParser: 基本元素结构解析器, complexStructParser: 复杂结构解析器 }
 * @emits 发送/暴露所有内部数据
 * @returns async parseResult
 *  <T>(s: Schemas, { foundationParser, complexStructParser }) => Promise<T>
 */
const structParserScheduler = async (schemas: Schemas, {
  foundationParser,
  complexStructParser
}) => {
  const schemasKeys = Object.keys(schemas);
  const result: any = {};
  let schemaItem: SchemaItem;
  await Promise.all(schemasKeys.map((key) => {
    schemaItem = schemas[key];
    switch (schemaItem.type) {
      case 'structObject':
      case 'structArray':
        return complexStructParser({
          schemaItem, schemas, result, key
        });
      case 'boolean':
      case 'number':
      case 'string':
      default:
        return foundationParser({
          schemaItem, schemas, result, key
        });
    }
  }));
  return result;
};

/**
 * 针对调度器的统一处理, 处理解析结果, 生成统一标准的上下文
 * @param {Function} f 外部传入的字段的解析器
 */
const generateParseResult: GenerateParseResult = (f) => async ({
  result, key, schemas, schemaItem
// }) => {
//   /** 定义上下文标准 */
//   const schemasParseContext = { schemas, schemaItem, resolveVal: '' };
//   await f(schemasParseContext);
//   /** 根据上下文标准赋值 */
//   result[key] = schemasParseContext.resolveVal;
// };
}) => result[key] = await f({ schemas, schemaItem });

/**
 * 根据使用增强器的标准 + 上下文标准实现Parser
 */
const defaultValParser: (
  ctx: DefaultSchemasParserContext,
) => unknown = async (
  { schemaItem }
  // ctx
) => {
  // 默认解开方式
  return defaultParserCollection.defaultVal(schemaItem as FoundationTypeSchemas);
  // const { schemaItem } = ctx;
  /** 根据上下文标准赋值 */
  // ctx.resolveVal = schemaItem.defaultVal === undefined ? 'undef' : `${schemaItem.defaultVal}newDef`;
};

/**
 * 数据模型解析器
 * @param schemas 数据模型
 */
const SchemasParser = (originSchemas: Schemas) => {
  const getSchemasInitValue = async () => {
    /** 增强 默认值解析器 */
    const { generateEnhancer } = Enhancer(
      foundationParserMiddleware,
      defaultValParser
    );

    const structParserParams = {
      foundationParser: generateParseResult(generateEnhancer()),
      complexStructParser: defaultCtxFn
    };

    /** 根据标准实现的默认的复杂结构解析器 */
    const defaultComplexStructParser = async (ctx) => {
      const { schemaItem } = ctx;
      // 默认解开方式
      return await structParserScheduler(schemaItem.struct, structParserParams);
      /** 根据上下文标准赋值 */
      // const parsrVal = await structParserScheduler(schemaItem.struct, structParserParams);
      // ctx.resolveVal = parsrVal;
    };

    /** 增强默认复杂结构解析器 */
    const enhancedComplexStructParser = Enhancer(
      complexStructParserMiddleware,
      defaultComplexStructParser
    ).generateEnhancer();

    /** 使用增强器 */
    // structParserParams.complexStructParser = generateParseResult(enhancedComplexStructParser);
    /** 不使用增强器 */
    structParserParams.complexStructParser = generateParseResult(defaultComplexStructParser);
    return await structParserScheduler(
      originSchemas,
      structParserParams
    );
  };

  return {
    getSchemasInitValue
  };
};
export default SchemasParser;
