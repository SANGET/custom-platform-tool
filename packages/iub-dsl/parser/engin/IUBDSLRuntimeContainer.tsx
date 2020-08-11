import React, { lazy, Suspense } from 'react';
import LayoutParser from './layout-parser';
import SchemasParser from './schemas/schemas-parser';
import { useIUBStore } from './state-manage';
import { compose } from './utils';
import { fnnnc } from './utils/enhancer';
// import { InitPageState } from './schemas/schemas-parser';

const sleep = (time = 1) => new Promise((resolve) => setTimeout(() => resolve(), time * 1000));

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

export default IUBDSLRuntimeContainer;
