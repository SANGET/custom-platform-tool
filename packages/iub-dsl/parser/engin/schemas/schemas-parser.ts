/* eslint-disable no-param-reassign */
import {
  Schemas, SchemaItem,
  FoundationTypeSchemas,
  ComplexTypeSchemas,
  CommonObjStruct,
  StructType, FoundationType
} from "@iub-dsl/core";
import { Enhancer } from "../utils/enhancer";
import { complexStructParserMiddleware, foundationParserMiddleware } from "./test-middleware";
import {
  FiledKey, DefaultFoundationTypeParser,
  GenerateParseResult, DefaultSchemasParserContext,
  SchedulerBasicContext, ReduceExtraContext
} from "./i-schemas-parser";

// namespace Core {
interface Send {
  (data): unknown;
}
interface Complete {
  (d): unknown
}
interface Next {
  (d): unknown
}

// 同步数据、 异步数据

// 流控数据
// ? 自定义业务逻辑?
// }

const defaultCtxFn = (ctx) => ctx;

/**
 * 生成内部默认字段解析器
 */
const defaultFieldParser = (key: string) => (schemaItem: FoundationTypeSchemas) => (schemaItem[key] !== undefined ? schemaItem[key] : '');
const defaultParserKey: FiledKey[] = ['type', 'defaultVal', 'fieldMapping'];
const defaultParserCollection = defaultParserKey.reduce((parser, key) => {
  parser[key] = defaultFieldParser(key);
  return parser;
}, {} as Record<FiledKey, DefaultFoundationTypeParser>);
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

/** otherparam是外部给到的ctx, 而2个parser是内部需要的param, 如果这样想第二个参数就是ctx */
const structParserScheduler2 = (schemas: Schemas, {
  foundationParser,
  complexStructParser,
  ...otherParams
}) => {
  const schemasKeys = Object.keys(schemas);
  let schemaItem: SchemaItem;
  return schemasKeys.map((key) => {
    schemaItem = schemas[key];
    switch (schemaItem.type) {
      case 'structObject':
      case 'structArray':
        return complexStructParser({
          schemaItem, schemas, key, ...otherParams
        });
      case 'boolean':
      case 'number':
      case 'string':
      default:
        return foundationParser({
          schemaItem, schemas, key, ...otherParams
        });
    }
  });
};

/**
 * 针对调度器的统一处理, 处理解析结果, 生成统一标准的上下文
 * @param {Function} f 外部传入的字段的解析器
 */
const generateParseResult: GenerateParseResult = (f) => async ({
  result, key, schemas, schemaItem
}) => result[key] = await f({ schemas, schemaItem });

/**
 * 根据使用增强器的标准 + 上下文标准实现Parser
 */
const defaultValParser: (
  ctx: DefaultSchemasParserContext,
) => unknown = async (
  { schemaItem }
) => {
  // 默认解开方式
  return defaultParserCollection.defaultVal(schemaItem as FoundationTypeSchemas);
};

/**
 * 数据模型解析器
 * @param schemas 数据模型
 */
const SchemasParser = (originSchemas: Schemas) => {
  const baseStruct = { };
  /**  */
  const paramContext: (ReduceExtraContext & SchedulerBasicContext<ReduceExtraContext>) = {
    foundationParser: ({ payload, schemaItem, key }) => {
      payload[key] = schemaItem.type;
    },
    complexStructParser: ({ payload, schemaItem, key }) => {
      paramContext.payload = {};
      if (schemaItem.type === 'structArray') {
        payload[key] = [paramContext.payload];
      } else {
        payload[key] = paramContext.payload;
      }
      structParserScheduler2(schemaItem.struct, paramContext);
    },
    payload: baseStruct
  };

  structParserScheduler2(originSchemas, paramContext);
  console.log(paramContext);
  console.log(baseStruct);

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
    };

    /** 增强默认复杂结构解析器 */
    const enhancedComplexStructParser = Enhancer(
      complexStructParserMiddleware,
      defaultComplexStructParser
    ).generateEnhancer();

    /** 使用增强器 */
    structParserParams.complexStructParser = generateParseResult(enhancedComplexStructParser);
    /** 不使用增强器 */
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
