import {
  Schemas, SchemaItem, ComplexType, FoundationType
} from "@iub-dsl/definition";

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
