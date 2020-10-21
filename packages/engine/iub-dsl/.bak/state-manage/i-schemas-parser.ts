import {
  Schemas, SchemaItem,
  FoundationTypeSchemas,
  CommonObjStruct,
  ComplexTypeSchemas,
} from "@iub-dsl/definition";

/** 基础解析时上下文 */
interface BaseParseContext<T> {
  schemas: Schemas;
  schemaItem: T;
  key: string
}

/** 调度器默认上下文 */
export interface SchedulerBasicContext<T = unknown, R = unknown> {
  foundationParser: (ctx: (BaseParseContext<FoundationTypeSchemas> & T)) => R,
  complexStructParser: (ctx: (BaseParseContext<ComplexTypeSchemas> & T)) => R,
}

/** XX额外上下文 */
export interface ReduceExtraContext {
  payload: any
}

/** 默认Schemas解析器的上下文标准 */
export interface DefaultSchemasParserContext {
  schemas: Schemas;
  schemaItem: SchemaItem;
}
interface StructParserInput extends DefaultSchemasParserContext {
  result: CommonObjStruct;
  key: string;
}

/**
 * @type T 某一种字段解析的结果
 */
export interface GenerateParseResult<T = string> {
  (f: FieldParser): (input: StructParserInput) => Promise<T>;
}
interface FieldParser<T = string, C = DefaultSchemasParserContext> {
  (context: C): Promise<T>
}
