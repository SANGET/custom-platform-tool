/* eslint-disable no-param-reassign */
import {
  Schemas, SchemaItem,
  FoundationTypeSchemas,
  ComplexTypeSchemas,
  CommonObjStruct,
  ComplexType, FoundationType,
  AllType
} from "@iub-dsl/definition";
import { MockLocationData, MockLocationType } from "@iub-dsl/demo/business-case/location-manager";
import { Enhancer, sleep, EnhancerHook } from "../utils";
import {
  FiledKey, DefaultFoundationTypeParser,
  SchedulerBasicContext, ReduceExtraContext
} from "./i-schemas-parser";

// 同步数据、 异步数据
// 流控数据
// ? 自定义业务逻辑?

const PATH_SPLIT_MARK = '/';
const ARR_MARK = '[]';
const PATH_SPLIT_MARK_ARR = ARR_MARK + PATH_SPLIT_MARK;
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
      if (schemaItem.type === ComplexType.structArray) {
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
 * TODO: 三个不同的逻辑如何分离
 */
const schemasPathAnalysis = (schemas: Schemas): {
  pathMapInfo: {[str: string]: PathMapInfoItem}
  baseStruct: { [str: string]: any }
  levelRelation: { [str: string]: string[] }
  topLevelArr: string[]
} => {
  const pathMapInfoResult = {};
  const levelRelationResult = {
  };
  const topLevelArr: string[] = [];
  const baseStructResult = {};

  const addLevelRelation = ({ parentPath, levelRelation, key }) => {
    if (!parentPath) {
      topLevelArr.push(key);
    } else {
      (levelRelation[parentPath] || (levelRelation[parentPath] = [])).push(key);
    }
  };

  const structParserSchedulerContext = {
    foundationParser: (runCtx) => {
      const {
        schemaItem, parentPath, baseStruct, key, pathMapInfo
      } = runCtx;
      /** 递归的第一个逻辑 */
      pathMapInfo[parentPath + key] = {
        ...schemaItem,
        [SCHEMAS_DEFAULT_KEY]: key,
        parentPath
      };
      /** 第三个逻辑, 建立结构关系 */
      addLevelRelation(runCtx);
      /** 递归的第二个逻辑 */
      baseStruct[key] = '';
    },
    complexStructParser: (runCtx) => {
      const {
        schemaItem: { struct, type }, parentPath, baseStruct, key, pathMapInfo, levelRelation
      } = runCtx;
      /** 公共逻辑新的父级path */
      let newParentPath = parentPath + key;
      /** 第三个逻辑, 建立结构关系 */
      addLevelRelation(runCtx);

      /** 递归的第一个逻辑 */
      pathMapInfo[newParentPath] = {
        type,
        [SCHEMAS_DEFAULT_KEY]: key,
        parentPath
      };
      /** 公共逻辑添加新父级的后缀 */
      newParentPath += (
        type === ComplexType.structArray ? PATH_SPLIT_MARK_ARR : PATH_SPLIT_MARK
      );
      /** 第三个逻辑 */
      levelRelation[newParentPath] = [];
      /** 改变递归逻辑数据 */
      structParserSchedulerContext.parentPath = newParentPath;

      /** 递归, 转换载体 */
      // pathMapInfo[newParentPath] = {};
      // structParserSchedulerContext.pathMapInfo = pathMapInfo[newParentPath];

      /** 递归的第二个逻辑 */
      structParserSchedulerContext.baseStruct = {};
      if (type === ComplexType.structArray) {
        baseStruct[key] = [structParserSchedulerContext.baseStruct];
      } else {
        baseStruct[key] = structParserSchedulerContext.baseStruct;
      }

      structParserScheduler(struct, structParserSchedulerContext);
    },
    baseStruct: baseStructResult,
    pathMapInfo: pathMapInfoResult,
    levelRelation: levelRelationResult,
    parentPath: ''
  };
  structParserScheduler(schemas, structParserSchedulerContext);

  return {
    pathMapInfo: pathMapInfoResult,
    baseStruct: baseStructResult,
    levelRelation: levelRelationResult,
    topLevelArr
  };
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
type PathMapInfoKeys = Exclude<keyof FoundationTypeSchemas, 'type'> | SCHEMAS_DEFAULT_KEY | 'parentPath'
/** schemas模型映射数据y */
type PathMapInfoItem = {
  [K in PathMapInfoKeys]: string;
} & {
  type: AllType;
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
  const {
    pathMapInfo, baseStruct, levelRelation, topLevelArr
  } = schemasPathAnalysis(originSchemas);
  const pathMapInfoKeys = Object.keys(pathMapInfo);

  console.log(pathMapInfo);
  console.log(pathMapInfoKeys);
  console.log(baseStruct);
  console.log(levelRelation);

  /** 获取某个路径key所有相关的路径的数据 「搜索」 */
  const getPathArr = (pathKey: string): string[] => {
    // TODO: 常量
    pathKey = pathKey.replace(/([\[\]])/g, '\\$1');
    const regRxp = new RegExp(`^${pathKey}`);
    const mathPathArr = pathMapInfoKeys.filter((k) => regRxp.test(k));
    return mathPathArr;
  };

  /**
   * 获取指定定位上级的key
   * @param key 页面数据模型位置定位的key
   * @param level 获取等级
   */
  const getParentPath = (key: string, level = 1, mathMark = PATH_SPLIT_MARK) => {
    const result: string[] = [];
    /** 单级快速处理 */
    if (level === 1) {
      const lastIdx = key.lastIndexOf(mathMark) + 1;
      result[0] = key.slice(lastIdx);
      result[1] = key.slice(0, lastIdx);
      return result;
    }
    /** 多级处理 */
    const keys = key.split(mathMark);
    const maxLevel = keys.length - 1;
    if (level === 0) { level = maxLevel; }
    let tempPath = '';
    let nowLevel;
    keys.every((k, i) => {
      nowLevel = maxLevel - i;
      if (nowLevel) {
        result[nowLevel] = tempPath + k;
        tempPath += k + mathMark;
        return true;
      }
      result[nowLevel] = k;
      return false;
    });
    console.log(result);
    return result.slice(0, level + 1);
  };

  const getMarkkey = (key:string) => key.replace(/[[|\]|/]/g, '');

  // 全量的结构 // 所有定位的key
  // 局部的结构 // 传入的key, 搜索一次,
  // 有父子关系的结构 // 传入的key, 搜索和向上搜索「处理?」
  // 单个和多个?
  // 针对传入的建立父子关系
  //

  const getLevelRelation = (key): {
    fatherPath: string;
    relationArr: string[]| undefined
  } => {
    let temp;
    if ((temp = levelRelation[key])) {
      return {
        fatherPath: key,
        relationArr: temp
      };
    }
    if ((temp = levelRelation[key + PATH_SPLIT_MARK])) {
      return {
        fatherPath: key + PATH_SPLIT_MARK,
        relationArr: temp
      };
    }
    return {
      fatherPath: key + PATH_SPLIT_MARK_ARR,
      relationArr: levelRelation[key + PATH_SPLIT_MARK_ARR]
    };
  };

  /** 目的! */
  interface GetSchemasKeyRelationOption {
    isGetSub?: boolean;
    isGetFather?: boolean;
    isGetBrother?: boolean;
  }
  interface OutParm {
    info: PathMapInfoItem,
    fatherInfo?: PathMapInfoItem,
    subInfo?: {
      path: string;
      subInfoArr?: PathMapInfoItem[]
    },
    brotherInfo?:{
      path: string;
      fatherInfo?: PathMapInfoItem[]
    },
  }
  /** 获取到信息然后呢? */
  const getSchemasKeyRelation = (handleKey, {
    isGetFather, isGetSub = true, isGetBrother
  }: GetSchemasKeyRelationOption) => {
    const pathMapInfoItem = pathMapInfo[handleKey];
    if (!pathMapInfoItem) {
      return false;
    }
    const outParam: OutParm = {
      info: pathMapInfoItem
    };

    if (isGetSub) {
      const { fatherPath, relationArr } = getLevelRelation(handleKey);
      const subPathMapInfo = relationArr?.map((k) => pathMapInfo[fatherPath + k]);
      outParam.subInfo = {
        path: fatherPath,
        subInfoArr: subPathMapInfo
      };
    }

    const [markKey, prevPath] = getParentPath(handleKey);
    if (isGetFather) {
      outParam.fatherInfo = pathMapInfo[getMarkkey(prevPath)];
    }
    if (isGetBrother) {
      // 向上查找的信息
      const { fatherPath, relationArr } = getLevelRelation(prevPath);
      const subPathMapInfo = relationArr?.map((k) => pathMapInfo[fatherPath + k]);
      console.log(prevPath);

      outParam.brotherInfo = {
        path: fatherPath,
        fatherInfo: subPathMapInfo
      };
    }

    return outParam;
  };

  const hand = (pathMapInfoItem: PathMapInfoItem, result) => {
    if (pathMapInfoItem.type === 'structObject') {
      result[pathMapInfoItem.schemasKey] = {};
    } else {
      result[pathMapInfoItem.schemasKey] = '';
    }
  };

  const handleInfoItem = (pathMapInfoItem: PathMapInfoItem) => (pathMapInfoItem.type === ComplexType.structObject ? {} : '');

  const ddd = (key, isDeep = false) => {
    const keyRelation = getSchemasKeyRelation(key, {});
    if (!keyRelation) {
      console.error(`没有获取到“${key}”的相关信息`);
      return false;
    }
    const { info, subInfo } = keyRelation;
    const handleResult = handleInfoItem(info);
    subInfo?.subInfoArr?.forEach((item) => {
      // 业务处理
      if (isDeep) {
        handleResult[item.schemasKey] = ddd(item.parentPath + item.schemasKey, isDeep);
      } else {
        handleResult[item.schemasKey] = handleInfoItem(item);
      }
    });
    return handleResult;
  };
  // handles("dId5[]/sdId3", hand);

  const rr = ddd('dId7', true);
  console.log(rr);

  /**
   * 生成映射对象的函数
   * @param pathKey 数据模型数据信息的定位信息
   * @param param1 MapConf
   */
  const generateObjMapFn = (pathKey: string, { from, to }: MapConf) => {
    const mathPathArr = getPathArr(pathKey);
    let pathMapInfoItem: PathMapInfoItem;
    const mapConfs: MapConf[] = [];
    mathPathArr.forEach((key) => {
      pathMapInfoItem = pathMapInfo[key];
      if (key !== pathKey) {
        mapConfs.push({
          from: pathMapInfoItem[from], // 是否需要验证?
          to: pathMapInfoItem[to],
        });
      }
    });
    return objMap(mapConfs);
  };

  /**
   * 转换数据 「分结构处理」
   * @param param0 MapDataParam
   */
  const mapData = <T>({ pathKey, mapConf, data }: MapDataParam<T>) => {
    const objMapFn = generateObjMapFn(pathKey, mapConf);
    return Array.isArray(data) ? data.map(objMapFn) : objMapFn(data);
  };

  // const tranRes = mapData({
  //   pathKey: 'dId4',
  //   mapConf: {
  //     from: 'fieldTag',
  //     to: SCHEMAS_DEFAULT_KEY,
  //   },
  //   data: MockLocationType
  // });

  // console.log(tranRes);

  /**
   * 问题: 全量循环, 无法局部
   *
   * 针对局部某部分数据进行处理, 同时也支持全量
   */
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
        if (schemaItem.type === ComplexType.structArray) {
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
  };
};

/** 整个结构的解析, 部分结构的解析, 根据字段解析, 根据业务需要扩展 */
export default SchemasParser;
