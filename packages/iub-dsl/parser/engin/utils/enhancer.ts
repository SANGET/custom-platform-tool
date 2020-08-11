import { asyncCompose } from ".";

const reso: any = [];

/**
 * 实验注意项
 * 1. 不要尝试将流程变得不可控, 除非有一套完备的规则 「验证过可以添加的」
 * 2. 不要动态修改调用过程
 * 特点
 * 1. 调用fn 是当前步骤, 将next封装好传入调用
 * 2. 还需要封装send、complete、subscription
 * 3. 提前返回、中间件的生命周期
 */

const asyncC = (middleware) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    function dispatch(i: number) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times 「next被多次调用」'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      // if (!fn) return Promise.resolve();
      if (!fn) return context;
      try {
        const ress = fn(context, dispatch.bind(null, i + 1));
        context.num = index;
        console.log('fnres', ress);
        return Promise.resolve(ress);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
};

interface SendData {
  type: string;
  data: any
}

interface Iaf {

  status: string;
  send(sendData: SendData)

  complete()
  subscribe(subscribeFn: (sendData: SendData) => unknown)

  getNowCtx()
}

const asyncComposeRun = ({
  lastHandle: originLastHandler,
  errorHandle,
  send
}) => (ctx, fnMiddleware) => {
  /** 中间键处理完最后一步 */
  const lastHandle = (firstStepRespone) => {
    console.log(firstStepRespone);
    ctx.status = 'end';
    send({
      type: 'end',
      data: ctx
    });
    return originLastHandler(ctx, firstStepRespone);
  };
  ctx.__echancerHandle__ = fnMiddleware(ctx, (res) => {
    console.log('sync end');
    ctx.status = 'sync end';
    return ctx;
  }).then(lastHandle).catch(errorHandle);
  return ctx;
};

export const fnnnc = (
  originEnhancerList: ((...args) => unknown)[] = [],
  {
    lastHandle = (ctx, ...args) => ctx,
    errorHandle = (err) => console.log(err),
  }
) => {
  // 可以添加,也是不稳定的 // 必须确保流程固定或者固定的描述
  const echancerList = [...originEnhancerList];

  const nextListeners: ((...args) => unknown)[] = [];
  let currentListeners: ((...args) => unknown)[] | null = null;
  // let isDispatching =  false

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    let isSubscribed = true;

    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      isSubscribed = false;
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  function send(sendData: SendData) {
    currentListeners = nextListeners;
    const listeners = currentListeners;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener(sendData);
    }
  }

  const handleMiddlewareRun = asyncComposeRun({ lastHandle, errorHandle, send });

  const generateEnhancer = () => {
    const runTimeFn = echancerList.slice();
    const fns = asyncC(runTimeFn);

    return (context) => {
      const ctx = typeof context === 'function' ? context() : context;
      send({
        type: 'end',
        data: ctx
      });
      return handleMiddlewareRun(ctx, fns);
    };
  };

  const addMiddleware = (fnMiddleware) => {
    echancerList.push(fnMiddleware);
    return () => {
      const idx = echancerList.indexOf(fnMiddleware);
      return echancerList.splice(idx, 1);
    };
  };

  return {
    generateEnhancer,
    addMiddleware,
    subscribe
  };
};

/**
 * 职能
 * 1. context贯穿所有执行
 * 2. 当作增强器提供增强标准 「对于XXX值增强对其处理、增强对context处理」
 * 3. 流程控制「正在和非正在运行的增删改」、提前返回, 多次返回, 多播, 控制可以作为插件/?
 *
 * onion「洋葱结构」: ctx, next, next().then(prevReturn「上一步同步执行的返回」 => )
 */
export const Enhancer = (
  originMiddleware: ((...args) => unknown)[] = [],
  originHandler = (ctx, ...args) => ctx,
  onerror = (err) => console.log(err)
) => {
  const middleware = [...originMiddleware];

  const handleMiddlewareRun = asyncComposeRun({ lastHandle: originHandler, errorHandle: onerror });

  const generateEnhancer = () => {
    const fn = asyncCompose(middleware.slice());
    /** 初始化第一步调用的 */
    const handle = (context) => {
      const ctx = typeof context === 'function' ? context() : context;
      return handleMiddlewareRun(ctx, fn);
    };
    return handle;
  };

  const addMiddleware = (fnMiddleware) => {
    middleware.push(fnMiddleware);
    return () => {
      const idx = middleware.indexOf(fnMiddleware);
      return middleware.splice(idx, 1);
    };
  };

  return {
    generateEnhancer,
    handleMiddlewareRun,
    addMiddleware
  };
};
