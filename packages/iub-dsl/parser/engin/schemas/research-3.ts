import {
  Schemas, SchemaItem, FoundationTypeSchemas, StructTypeSchemas
} from "@iub-dsl/core";
import React, { useState, useEffect, useContext } from 'react';
import { Enhancer } from "../utils/enhancer";

// 洋葱皮结构的中间件
const middleware1 = [
  async (ctx, next) => {
    console.log(1);
    // console.log(ctx);
    const newCtx = await next();
    console.log(6);
    return newCtx;
  },
  (ctx, next) => {
    console.log(2);
    // console.log(ctx);
    next();
    console.log(4);
    return ctx;
  },
  async (ctx, next) => {
    console.log(3);
    // console.log(ctx);
    await next();
    console.log(5);
    // return ctx;
  },
];

const foundationMiddleware = [
  async (ctx, next) => {
    console.log(1, ctx);
    const newCtx = await next();
    console.log(3, newCtx);
    return newCtx;
  },
];

const complexMiddleware = [
];

type PluginRef = any
interface FoundationParserEnhancer {
  fieldMapping?: PluginRef;
  defaultVal?: PluginRef;
  alias?: PluginRef;
  desc?: PluginRef;
  tag?: PluginRef;
}

const structParser = (struct: FoundationTypeSchemas) => (enhancer) => enhancer(struct);
// 结构解析
// 字段解析 // 增强
const metaDataMappingParser = () => {
  return '';
};
const defailtValParser = (struct: FoundationTypeSchemas) => {
  console.log(struct);
  return struct.defaultVal ? struct.defaultVal : '';
};

const commonStructReduce = (struct, callback) => {
  if (typeof struct !== 'object') {
    return callback(struct);
  }

  if (Array.isArray(struct)) {
    return struct.map((s) => commonStructReduce(s, callback));
  }

  return Object.keys(struct).reduce((res, key) => {
    res[key] = commonStructReduce(struct[key], callback);
    return res;
  }, {});
};

/**
 * 针对固定的schemas结构进行调度解析器进行解析
 */
const structParserSchedulerA = async (schemas: Schemas, {
  foundationParser,
  complexStructParser
}) => {
  const schemasKeys = Object.keys(schemas);
  let schemaItem: SchemaItem;
  let i = 0; const l = schemasKeys.length;
  const result = {};
  for (;i < l; i++) {
    schemaItem = schemas[schemasKeys[i]];
    switch (schemaItem.type) {
      case 'structObject':
      case 'structArray':
        // eslint-disable-next-line no-await-in-loop
        result[schemasKeys[i]] = await complexStructParser({
          schemaItem,
          schemas,
          // foundationParser,
          // complexStructParser
        });
        break;
      case 'boolean':
      case 'number':
      case 'string':
      default:
        // TODO
        // eslint-disable-next-line no-await-in-loop
        result[schemasKeys[i]] = await foundationParser({ schemaItem, schemas });
        break;
    }
  }
  return result;
};

/**
 * 针对固定的schemas结构进行调度解析器进行解析
 * @param schemas Schemas
 * @param param1 { foundationParser: 基本元素结构解析器, complexStructParser: 复杂结构解析器 }
 * @emits 发送/暴露所有内部数据
 * @returns async parseResult
 */
const structParserScheduler = async (schemas: Schemas, {
  foundationParser,
  complexStructParser
}) => {
  const schemasKeys = Object.keys(schemas);
  const result = {};
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

interface AA {
  (options: {
    schemaItem: StructTypeSchemas,
    schemas: Schemas,
    result: any,
    key: string,
    foundationParser?: any,
    complexStructParser?: any
  }): unknown
}

const originComplexStructParser: AA = ({
  schemaItem, schemas, result,
  foundationParser, complexStructParser
}) => {
  return structParserScheduler(schemaItem.struct, {
    foundationParser, complexStructParser
  });
};

const originFoundationParser: AA = ({
  schemaItem, schemas, result, key
}) => {
  console.log(2, schemaItem);
  return schemaItem.type;
};

/**
 * @description 原则
 * *1. 解析恒定的数据结构
 * *2. 不同数据结构的解析和运行由外部动态确定用什么增强
 *
 * @description 问题
 * !1. 以隔离为目的还有没有更好的方法 「有, ..」
 * !2. 异步问题「组件、循环中的异步」
 * !3. 通用结构的转换和处理还需要有更好的方法
 */
export const schemasStructParser = (
  originSchemas: Schemas,
) => {
  /** 动态生成已经增强的解析器 */
  const fn = Enhancer(originFoundationParser)(foundationMiddleware);
  // const fn = Enhancer(originFoundationParser)(middleware1);

  const cFn = Enhancer(({ schemaItem }) => {
    return structParserScheduler(schemaItem.struct, {
      complexStructParser: cFn,
      foundationParser: fn
    });
  })(foundationMiddleware);
  /** 动态生成已经增强的解析器 - END */

  // 将上下文交给外部API实现时候生成
  const generateResolveApi = (f) => async ({
    result, key, schemas, schemaItem
  }) => result[key] = await f({ schemas, schemaItem });

  structParserScheduler(originSchemas, {
    complexStructParser: generateResolveApi(cFn),
    foundationParser: generateResolveApi(fn)
  }).then((r) => {
    console.log(r);
  });

  const getInitStructParser = () => {
    return {};
  };

  return {
    getInitStructParser
  };
};

// * 上下文 、 形式?
// * 目的解析结构、增强解析结构的能力
/**
 * 提供有关schemas结构处理的api, 增强在外部传入
 */

// 不同filed 使用到底有啥用? 外部传入plugin
/**
const structParserScheduler1 = (schemas: Schemas) => {
  const dIdArr = Object.keys(schemas);
  let i = 0;
  let schemaItem: SchemaItem; let parseRes;
  const l = dIdArr.length;
  const parseStructRes = {};
  for (;i < l; i++) {
    schemaItem = schemas[dIdArr[i]];
    switch (schemaItem.type) {
      case 'structObject':
        parseRes = structParserScheduler1(schemaItem.struct);
        break;
      case 'structArray':
        parseRes = () => [];
        break;
      case 'boolean':
        parseRes = structParser(schemaItem);
        break;
      case 'number':
        parseRes = structParser(schemaItem);
        break;
      case 'string':
      default:
        parseRes = structParser(schemaItem);
        break;
    }
    parseStructRes[dIdArr[i]] = parseRes;
  }
  return parseStructRes;
};
 */

/**
export const schemasStructParser = (
  schemas: Schemas,
  pluginConf?: FoundationParserEnhancer //
) => {
  const createFn = Enhancer(defailtValParser);

  // 方法: 先定位结构, 解析时候再实际运行
  const parseStructRes = structParserScheduler(schemas);
  function getInitStructParser(plugins?) {
    return commonStructReduce(parseStructRes, (fn) => {
      fn((struct) => {
        createFn(struct, middleware1).then((res) => {
          console.log('end');
          console.log(res);
        });
      });
      return {};
      // return fn(defailtValParser);
    });
  }

  function metadataTransform(plugins?) {
    // 元数据转换的插件是外部的,
    return (sc) => {
      return sc;
    };
  }
  return {
    getInitStructParser,
    metadataTransform
  };
};
*/

// 字段处理是结构处理的插件
// 结构转换作为一个插件提供给状态管理
// 引擎作为一个插件提供给? 单独的字段处理?

// 对于store,如何增强状态变更,状态定位「结构」, 数据结构转换「结构 + 元数据」?

/**
 * ? 结构是统一的, 结构是个插件
 * ? 解析是结构处理的插件
 * ? 状态管理,也是结构的插件
 * ? 结构 + 结构处理 生成 新的插件API 「field、tag」
 * ? 结构 + 状态管理 生成 使用管理
 * ? 状态结构和schemas结构是不一样的
 */
export const useIUBStore = (
  schemasStruct,
  enhancerConfig?,
) => {
  console.log(schemasStruct); // 实际数据结构

  const [state, set] = useState(schemasStruct);
  function getState() { // 增强
    return state;
  }

  function setState(newState) { // 增强
    set(newState);
  }
  return {
    setState,

  };
};

// 1. 解析数据结构输出另一种数据
// 2. 初始化
// 3. 运行

// 1. 主线 id, type
// 2. 增强器? 每个typePar
// 3. 结构固定字段获取固定解析结果

/**
 * ! 错误的例子
 * 数据模型解析器
 * @param schemas 数据模型
 */
const SchemasParser = (originSchemas: Schemas) => {
  /** defaultVal举例, 按照固定上下文标准实现的默认解析器 */
  const defaultValParser = async ({ schemaItem }) => {
    return defaultParserCollection.defaultVal(schemaItem as FoundationTypeSchemas);
  };

  /**
   * 1. 运行上下文由外部调用确定 「标准」
   * 2. 增强作用, 剔除,或者使用都不受影响
   */

  const { generateEnhancer, } = Enhancer(
    foundationParserMiddleware,
    // defaultValParser,
    generateParseResult(defaultValParser)
  );
  const fn = generateEnhancer();

  const defaultComplexStructParser = async ({ schemaItem }) => {
    return await structParserScheduler(schemaItem.struct, {
      complexStructParser: cFn,
      // foundationParser: generateParseResult(fn)
      foundationParser: fn // 这样子上下文会在调度器产生
    });
  };

  const cFn = Enhancer(
    complexStructParserMiddleware,
    generateParseResult(defaultComplexStructParser)
    // defaultComplexStructParser
  ).generateEnhancer();

  const getSchemasInitValue = async () => {
    return structParserScheduler(originSchemas, {
      complexStructParser: cFn,
      // complexStructParser: generateParseResult(defaultComplexStructParser),
      // foundationParser: generateParseResult(fn)
      foundationParser: fn // 这样子上下文会在调度器产生
    });
  };

  return {
    getSchemasInitValue
  };
};
