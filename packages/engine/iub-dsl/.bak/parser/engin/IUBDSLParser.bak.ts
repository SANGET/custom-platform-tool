import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import LayoutParser from "./layout";
import flowExecutor from "./flow";
import parseMetaData from "./meta-data/metaData";
import { parseRelation } from "./relation";

/**
 * 1. 页面运行上下文的生成、数据仓库、
 * 2. 事件绑定的时机？
 * 3. 每个时机都是可以独立解析的，可以使用接口反射  ??
 * 4. 绑定数据的时刻、钩子、反射？
 */

const parseSchemas = (...args) => {};
const parsesysInput = (...args) => {};
const parsesysOutput = (...args) => {};

const IUBDSLParser = ({
  dsl, context
}: ParserParamsOfIUBDSL) => {
  const {
    layoutContent, componentsCollection, actionsCollection,
    metadataMapping, relationshipsCollection, schemas,
    sysRtCxtInterface
  } = dsl;

  const result: { [str: string]: unknown } = {};

  // parseMetaData 解析元数据映射，数据转换时调用、使用关系时候调用
  result.metadataEntity = parseMetaData(metadataMapping);
  // schemas 页面渲染解析前调用
  result.store = parseSchemas(schemas);
  // relationshipCollection 任何时候都可能调用
  parseRelation('schemasCreate', relationshipsCollection);
  parsesysInput(sysRtCxtInterface, result);

  // 每个解析器都是独立的，应该是外部需要调用的时候直接调用，根据解析器需要的参数
  // 而解析器相互之间是存在依赖的，
  // context贯穿所有解析器，相互依赖。相互取用，利用context来解决依赖和耦合

  // 想法
  // 1. 解析器能够独立调用。使用的应该是依赖注入
  // 2. 外部应该也不需要关心解析器所需要的上下文，应该是独立的职能。
  // 3. 如果用上下文贯穿应该也是有问题的？？？举例子。或者说上下文如何做到解偶

  // 内部定义Interfance标准，外部传入？

  // 内部不需要知道参数，外部传入，内部用方法获取
  const parserContext = {
    context,
    // metaDataMapping,
    bindAction: (actionID) => {
      // console.log(actionID);
      return actionsCollection[actionID];
    },
    bindComponent: (componentID) => {
      // console.log(componentID);
      return componentsCollection[componentID];
    },
  };

  try {
    // TODO: general / custom
    return LayoutParser({
      layoutNode: layoutContent.content
    }, parserContext);
  } catch (e) {
    return '';
  } finally {
    parsesysOutput();
  }
};

//   try {
//     switch (layoutContent.type) {
//       case 'general':
//         // TODO: 订阅其他页面的数据变化
//         // context.subscribeDataChange(sysRtCxtInterface);
//         return layoutParser({
//           layoutNode: layoutContent,
//         }, parserContext);
//       case 'custom':
//         return '';
//       default:
//         return '';
//     }
//   } catch (e) {
//     return 'error';
//   } finally {
//     parsesysOutput();
//   }

// 绑定数据、观察变化、局部优化
// TODO: 每次都是重新解析渲染
/**
 * 预编译
 * 实际使用
 * dataChange
 * vaild --> fn/view
 * 由规则进行绑定事件~~~
 * 流程控制
 * context?
 * 数据变更关系的解析、数据收集
 * 弹窗、页面通信
 * 校验: TODO
 *
 * Relation: 解决副作用、拦截、通用、动态插拔的关系??
 */
const IUBDSLParser2 = ({
  dsl, context // 需要的上下文依赖
}: ParserParamsOfIUBDSL) => {
  const {
    layoutContent, componentsCollection, actionsCollection,
    metadataCollection, relationshipsCollection, schemas,
    sysRtCxtInterface
  } = dsl;
  const d = Date.now();
  let parseRelationRes: CommonObjStruct = {};
  let parseContext = {};
  // 数据模型解析
  const {
    // pageRuntimeState, setPageRuntimeState
    schemaStruct, mappingEntity
  } = DataSchemasParser({ metadataCollection, schemas });

  // TODO: 建立引用关系,动态获取其他页面引用的数据 ??
  const { pageRuntimeState, setPageRuntimeState } = InitPageState(schemaStruct);
  parseContext = {
    mappingEntity,
    pageRuntimeState,
    setPageRuntimeState,
  };
  // action的依赖??
  parseRelationRes = RelationParser('DataSchemasParseEnd', relationshipsCollection, parseContext);
  console.log(parseRelationRes);

  const parseActionResult = ActionsCollectionParser(actionsCollection);

  parseContext = {
    ...parseContext,
    ...parseRelationRes,
    bindAction: (actionID) => parseActionResult[actionID]
  };

  // 验证依赖和时机是否满足、满足则执行
  // parseRelation('', relationshipsCollection, parseContext);

  const componentParseRes = ComponentCollectionParser(componentsCollection, parseContext);

  parseContext = {
    ...parseContext,
    bindComponent: (compId) => componentParseRes[compId]
  };

  const layoutParseRes = LayoutParser({ layoutNode: layoutContent.content }, parseContext);

  parseContext = {
    ...parseContext,
    layoutParseRes,
  };

  console.log(Date.now() - d);

  console.log(parseContext);

  return parseContext;
};

const IUBDSLRuntimeContainer = ({ dslParseRes }) => {
  const {
    layoutContent, compParseRes,
    schemas, mappingEntity
  } = dslParseRes;

  // //  应该要再分离一层
  // // const { pageRuntimeState, setPageRuntimeState } = InitPageState(schemaStruct);
  // const runtimeContext = {
  //   pageRuntimeState,
  //   // setPageRuntimeState
  // };
  // layoutContent.bindComponent = (compId) => compParseRes[compId](runtimeContext);
  // const layoutParseRes = LayoutParser({
  //   layoutNode: layoutContent.content,
  //   componentWrapper: (Comp, { id, idx }) => {
  //     // console.log(id, idx);
  //     return <div key={id} style={{ margin: '5px' }}>{Comp}</div>;
  //   }
  // }, layoutContent);
  // 数据模型解析
  // const { getSchemasInitValue } = SchemasParser(schemas);

  // const { getState } = useIUBStore(getSchemasInitValue);
  // const fn1 = ({ dispatch, get }) => (next) => (action) => {
  //   console.log(1, action);
  //   next(action);
  //   return { a: 4 };
  // };
  // const fn2 = ({ dispatch, get }) => (next, cc) => (action, oo) => {
  //   console.log(oo, cc);
  //   console.log(2, action);
  //   next(action);
  //   return { a: 7 };
  // };
  // const fn3 = ({ dispatch, get }) => (next) => (action) => {
  //   console.log(3, action);
  //   next(action);
  // };
  // const fn4 = ({ dispatch, get }) => (next) => (action) => {
  //   console.log(4, action);
  //   next(action);
  // };

  // const fn = ({ dispatch, get }) => (next, cc) => (action, oo) => {
  //   // loop
  //   console.log(oo, cc);
  //   if (action.type === 1) {
  //     action.type = 2;
  //     dispatch(action);
  //   } else {
  //     next(action);
  //   }
  // };

  // const state = getState();
  // console.log(state);

  // const originDistach = (...action) => {
  //   console.log('action', action);
  //   return action;
  // };

  // const middlewares = [
  //   fn1,
  //   fn2,
  // fn,
  // fn3,
  // fn4,
  // ];

  // let dispatch = (...args) => {};

  // const middlewareAPI = {
  //   get: { a: 1 },
  //   dispatch: (...args) => dispatch(...args)
  // };

  // const chain = middlewares.map((middleware) => middleware(middlewareAPI));

  // console.log(compose(...chain).toString());
  // dispatch = compose(...chain)(originDistach);
  // console.log(dispatch);
  // console.log(dispatch({ type: 1, payload: {} }));

  const a = true;

  const mm = [
    async (ctx, next) => {
      console.log(1, ctx);
      const prevRes = await next();
      console.log(prevRes);
      return '1ctx';
    },
    async (ctx, next) => {
      console.log(2, ctx);
      await next();
      await sleep();
      console.log('cc2');
      return '2ctx';
    },
    (ctx, next) => {
      console.log(3, ctx);
      const prevRes = next();
      sleep();
      console.log(prevRes);
      return '3ctx';
    },
    async (ctx, next) => {
      console.log(4, ctx);
      ctx.b = 3;
      const prevRes = await next();
      await sleep();
      console.log(prevRes);
      return '4ctx';
    },
  ];

  const ctx = {
    a: 1
  };

  const { generateEnhancer, addMiddleware, subscribe } = fnnnc(mm, {});
  subscribe((data) => {
    console.log(140);
    console.log(data);
  });
  const res = generateEnhancer()(ctx);
  console.log(JSON.stringify(res));
  res.__echancerHandle__.then((rr) => {
    console.log(rr);
  });

  subscribe((data) => {
    console.log(150);
    console.log(data);
  });
  subscribe((data) => {
    console.log(160);
    console.log(data);
  });

  // const { getState, setState } = SchemasParser(schemas, () => true);
  // console.log(dslParseRes);
  // return layoutParseRes;
  // const { getInitStructParser } = SchemasParser(schemas);
  // getInitStructParser();
  // return <Suspense fallback={'加载中'}><pre>{JSON.stringify({})}</pre></Suspense>;
  return <pre>{JSON.stringify({})}</pre>;
};

export default IUBDSLParser;

// 行为与表现分离
