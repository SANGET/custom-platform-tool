/* eslint-disable no-param-reassign */
import {
  Schemas, SchemaItem,
  FoundationTypeSchemas,
  ComplexTypeSchemas,
  CommonObjStruct,
  StructType, FoundationType
} from "@iub-dsl/core";
import { MockLocationData, MockLocationType } from "@iub-dsl/demo/business-case/location-manager";
import { Enhancer, sleep, EnhancerHook } from "../utils";
import { complexStructParserMiddleware, foundationParserMiddleware, testEnhancer } from "./test-middleware";
import {
  FiledKey, DefaultFoundationTypeParser,
  SchedulerBasicContext, ReduceExtraContext
} from "./i-schemas-parser";

// 同步数据、 异步数据
// 流控数据
// ? 自定义业务逻辑?

const PATH_SPLIT_MARK = '/';
const PATH_SPLIT_MARK_ARR = '[]/';
type SCHEMAS_DEFAULT_KEY = 'schemasKey'
const SCHEMAS_DEFAULT_KEY = 'schemasKey';

function transformData(d: any[]) {
  return d.map((_) => ({ ..._, sdId1: _.name, sdId2: _.type }));
}

function transformData2(d: any[]) {
  return d.map((_) => ({
    sdId1: _.id, sdId2: _.locationName, sdId3: _.locationType, sdId4: _.pid
  }));
}

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
 *  otherparam是外部给到的ctx, 而2个parser是内部需要的param, 如果这样想第二个参数就是ctx
 */
const structParserScheduler = (schemas: Schemas, {
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

const defaultParserMiddleware = [
  {
    handle: async (ctx, broadcast, next) => {
      await next();
    },
    resolveHandle: (c, param) => {
      const { schemaItem } = c;
      return defaultParserCollection.defaultVal(schemaItem);
    }
  },
  {
    handle: async (ctx, broadcast, next) => {
      await sleep();
      await next();
      await sleep(2);
      // broadcast({
      //   type: 'comp',
      //   context: ctx,
      //   data: {
      //     newState: {
      //       [ctx.key]: 'new'
      //     }
      //   }
      // });
    },
  },
];

const defaultComplexMiddleware = [
  {
    handle: async (ctx, broadcast, next) => {
      // console.log(ctx);
      const {
        prevPayload, paramContext, key, schemaItem
      } = ctx;
      const pyload = paramContext.payload;
      await next();
      /** 这里就需要转换了 */
      if (schemaItem.type === "structArray") {
        if (schemaItem.desc === '位置类型数据') {
          await sleep(2);
          const resolvedData = transformData(MockLocationType);
          broadcast({
            type: 'comp',
            context: ctx,
            data: {
              newState: {
                [key]: resolvedData
              }
            }
          });
        } else {
          await sleep(4);
          const resolvedData = transformData2(MockLocationData);
          broadcast({
            type: 'comp',
            context: ctx,
            data: {
              newState: {
                [key]: resolvedData
              }
            }
          });
        }
      }
    },
    resolveHandle: ({ paramContext }, param) => {
      paramContext.payload = {}; // 重新定义当前解析的载体
      return paramContext.payload;
    }
  },
];

/**
 * 分析页面数据模型
 * @param schemas 页面数据模型
 * @returns key: 定位信息, value: 对应位置映射的数据模型信息
 */
const schemasPathAnalysis = (schemas: Schemas): { [str: string]: PathMapInfoItem } => {
  const schemasPath = {};
  const structParserSchedulerContext = {
    foundationParser: ({
      schemaItem, parentPath, result, key
    }) => {
      result[parentPath + key] = {
        ...schemaItem,
        schemasKey: key
      };
    },
    complexStructParser: ({
      schemaItem: { struct, type }, parentPath, result, key
    }) => {
      parentPath += key;
      result[parentPath] = {
        type,
        schemasKey: key
      };

      structParserSchedulerContext.parentPath = parentPath + (type === 'structArray' ? PATH_SPLIT_MARK_ARR : PATH_SPLIT_MARK);
      structParserScheduler(struct, structParserSchedulerContext);
    },
    result: schemasPath,
    parentPath: ''
  };
  structParserScheduler(schemas, structParserSchedulerContext);

  return schemasPath;
};

/**
 * 将一个对象的key根据映射信息转换
 * @param mapConfs 如何映射的数组「from -> to」
 * @returns 映射转换后的对象
 */
const objMap = (
  mapConfs: MapConf[]
) => <T = unknown>(needMapObj: T) => mapConfs.reduce((result, conf) => {
  result[conf.to] = needMapObj[conf.from] || 'mapValErr';
  return result;
}, {});

/** 描述对象从[from]: any 转换成 [to]:any */
interface MapConf {
  from: string;
  to: string;
}

/** schemas模型映射数据所有key */
type PathMapInfoKeys = Exclude<keyof FoundationTypeSchemas, 'defaultVal'> & SCHEMAS_DEFAULT_KEY
/** schemas模型映射数据y */
type PathMapInfoItem = {
  [K in PathMapInfoKeys]: string;
};

/** 映射的参数 */
interface MapDataParam<T> {
  pathKey: string;
  mapConf: MapConf;
  data: T | T[]
}

/**
 * 数据模型解析器
 * @param schemas 数据模型
 */
const SchemasParser = (originSchemas: Schemas) => {
  const baseStruct = { };

  const schemasPathMapInfo = schemasPathAnalysis(originSchemas);
  const schemasPathMapInfoKey = Object.keys(schemasPathMapInfo);

  // console.log(schemasPathMapInfo);
  // console.log(schemasPathMapInfoKey);

  /** 获取某个路径key所有相关的路径的数据 */
  const getPathArr = (pathKey: string): string[] => {
    pathKey = pathKey.replace(/([\[\]])/g, '\\$1');
    const regRxp = new RegExp(`^${pathKey}`);
    const mathPathArr = schemasPathMapInfoKey.filter((k) => regRxp.test(k));
    return mathPathArr;
  };

  /**
   * 生成映射对象的函数
   * @param pathKey 数据模型数据信息的定位信息
   * @param param1 MapConf
   */
  const generateObjMapFn = (pathKey: string, { from, to }: MapConf) => {
    const mathPathArr = getPathArr(pathKey);
    let pathMapInfo: PathMapInfoItem;
    const mapConfs: MapConf[] = [];
    mathPathArr.forEach((key) => {
      pathMapInfo = schemasPathMapInfo[key];
      if (key !== pathKey) {
        mapConfs.push({
          from: pathMapInfo[from], // 是否需要验证?
          to: pathMapInfo[to],
        });
      }
    });
    return objMap(mapConfs);
  };

  /**
   * 转换数据
   * @param param0 MapDataParam
   */
  const mapData = <T>({ pathKey, mapConf, data }: MapDataParam<T>) => {
    const objMapFn = generateObjMapFn(pathKey, mapConf);
    return Array.isArray(data) ? data.map(objMapFn) : objMapFn(data);
  };

  const tranRes = mapData({
    pathKey: 'dId4',
    mapConf: {
      from: 'fieldTag',
      to: 'schemasKey',
    },
    data: MockLocationType
  });

  console.log(tranRes);

  const getSchemasInitValue = () => {
    const allListener: any[] = [];
    const allRuningHandle = (listener) => {
      if (typeof listener === 'function') {
        allListener.push(listener);
      }
    };
    const send = (d) => {
      allListener.forEach((fn) => fn(d));
    };

    if (Object.keys(baseStruct).length > 0) {
      return {
        baseStruct,
        allRuningHandle
      };
    }

    /**  */
    const paramContext: (ReduceExtraContext & SchedulerBasicContext<ReduceExtraContext>) = {
      foundationParser: ({
        payload, schemaItem, key, schemas
      }) => {
        const { generateHandle, subscribe } = Enhancer(defaultParserMiddleware, {});
        // if (schemaItem.defaultVal || schemaItem.tag) {
        subscribe((res) => {
          if (res.type === 'comp') {
            if (res.data) {
              send(res.data);
            }
          }
        });
        // }
        const {
          firstResponse, runingHandle, context
        } = generateHandle({ schemaItem, key, schemas }, {});

        // runingHandle().then((r) => {
        //   console.log(`handleEnd+-+${key}`);
        // });
        payload[key] = firstResponse;
      },
      complexStructParser: ({
        payload: prevPayload, schemaItem, schemas, key
      }) => {
        const { generateHandle, subscribe } = Enhancer(defaultComplexMiddleware, {});

        subscribe((res) => {
          // if (res.type === EnhancerHook.end) {
          if (res.type === 'comp') {
            if (res.data) {
              send(res.data);
            }
          }
        });

        const {
          firstResponse, runingHandle, context
        } = generateHandle({
          schemaItem, key, schemas, paramContext, prevPayload
        }, {});
        // runingHandle().then((r) => {
        //   console.log(r);
        // });
        if (schemaItem.type === 'structArray') {
          prevPayload[key] = [firstResponse];
        } else {
          prevPayload[key] = firstResponse;
        }
        structParserScheduler(schemaItem.struct, paramContext);
      },
      payload: baseStruct
    };

    structParserScheduler(originSchemas, paramContext);
    return {
      baseStruct,
      allRuningHandle
    };
  };

  return {
    getSchemasInitValue,
    mapData,
    originSchemas,
    schemasPathMapInfo,
    schemasPathMapInfoKey
  };
};

/** 整个结构的解析, 部分结构的解析, 根据字段解析, 根据业务需要扩展 */
export default SchemasParser;
