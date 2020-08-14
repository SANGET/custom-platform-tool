// import { asyncCompose } from ".";
/**
 * 全局的
 * 1. when, 当...时机
 * 2. condition, ...条件
 * 3. runtimeContext
 * 4. IUB—DSLContext
 * 5. 流控??
 */

const sleep = (time = 1) => new Promise((resolve) => setTimeout(() => resolve(), time * 1000));

/**
 * 实验注意项
 * 1. 不要尝试将流程变得不可控, 除非有一套完备的规则 「验证过可以添加的」
 * 2. 不要动态修改调用过程
 * 特点
 * 1. 调用fn 是当前步骤, 将next封装好传入调用
 * 2. 还需要封装send、complete、subscription
 * 3. 提前返回、中间件的生命周期
 */

/**
  * 洋葱皮特点总结 // ! 重点 流程: 全阻塞、半阻塞、非阻塞, 流程结构控制
  * 1. 可以有一个一直在最后的中间件
  * 2. dispatch返回非Promise 或者 中间件next没有使用await阻塞运行, 都会产生一条新的运行分支「模拟并发
  *   而且新的分支不会受到后续调用的所有影响, 但是之前的步骤的影响还是存在的 //! 注意, 控制流程,防止流程失控
  * 3. 由上可得, 非阻断编程可以提前返回结果, 并且使用的是一个context,
  *   而且运行第一步的dispatch时, 返回为非阻塞, 可以直接当同步结果使用
  */

/**
 * 职能
 * 1. context贯穿所有执行
 * 2. 当作增强器提供增强标准 「对于XXX值增强对其处理、增强对context处理」
 * 3. 流程控制「正在和非正在运行的增删改」、提前返回, 多次返回, 多播, 控制可以作为插件/?
 *
 */

type AsyncMiddlewareFn<C = any, R = unknown> = (
  context: C, broadcast, next: () => Promise<R> | C
) => R;

interface MiddleWareItem<C = any, R = unknown, E = unknown> {
  handle: AsyncMiddlewareFn<C, R>;
  resolveHandle?: (
    ctx: C,
    param: {
      step: number,
      handleResult: R,
      broadcast
    },
  ) => Promise<R> | C // 中断的返回不确定~~ {这类型又不会写}
}

export enum EnhancerHook {
  start = 'start',
  end = 'end',
  allNextRun = 'allNextRun',
  allNextResolve = 'allNextResolve',
  allResolve = 'allResolve'
}

const generateBaseBoradcast = ({
  context, maxCount, broadcast, type
}) => {
  let count = 0;
  return () => {
    if (++count === maxCount) {
      broadcast({
        type,
        context
      });
    }
  };
};

/**
 * 什么周期
 * 1. 所有next之前调用完整, 所有next 都已经被调用处于等待状态,
 * 2. 所有next运行完成
 * 3. TODO: 不同分支的跟踪
 */
const asyncCompose = (
  // TODO: R和LS的泛型有一定的问题的, 暂时不知道怎么写
  middleware: MiddleWareItem[],
  {
    broadcast,
    baseResolveHandle = (fnRes) => Promise.resolve(fnRes)
  }
) => {
  return (context, lastMiddleware?: MiddleWareItem) => {
    let index = -1;
    const middlewareCount = lastMiddleware === undefined
      ? middleware.length : middleware.length + 1;

    /** 所有next均已调用完成, */
    const nextRun = generateBaseBoradcast({
      context, maxCount: middlewareCount, broadcast, type: EnhancerHook.allNextRun
    });
    /** 所有next均已调用完成, */
    const nextResolve = generateBaseBoradcast({
      context, maxCount: middlewareCount, broadcast, type: EnhancerHook.allNextResolve
    });
    /** 所有中间件已经调用完成处理的钩子, 但中间件本身不是promise并不会受控 */
    const handleResolve = generateBaseBoradcast({
      context, maxCount: middlewareCount, broadcast, type: EnhancerHook.allResolve
    });
    return dispatch(0);
    function dispatch(i: number) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times 「next被多次调用」'));
      index = i;
      let fn: MiddleWareItem = middleware[i];
      if (i === middleware.length && lastMiddleware !== undefined) fn = lastMiddleware;
      /** 最后一步中间件then的结果 */
      // if (!fn) return Promise.resolve();
      if (!fn) return context;
      try {
        const { handle, resolveHandle } = fn;
        const nextHandle = dispatch.bind(null, i + 1);
        const runFnRes = handle(context, broadcast, async () => {
          // 所有next已被调用
          nextRun();
          return await nextHandle();
        });
        const resolveRes = typeof resolveHandle === 'function' ? resolveHandle(context, { step: i, handleResult: runFnRes, broadcast }) : baseResolveHandle(runFnRes);

        // 所有next已被调用, 比上面的慢一点
        if (resolveRes instanceof Promise) {
          return new Promise((resolve, reject) => {
            resolveRes.then((res) => {
              nextResolve();
              handleResolve();
              resolve(res);
            });
          });
        }
        nextResolve();
        if (runFnRes instanceof Promise) {
          runFnRes.then((re) => {
            handleResolve();
          });
        } else {
          handleResolve();
        }
        // 此处计数是所有await之前以及运行完
        return resolveRes;
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
};

/** 针对asyncCompose封装给外部使用 */
/**
 * 1. lastMiddleware、Params处理「 lasterParams」
 * 2. 中间件管理, 不变和可变?
 * 3. generate的时候绑定, 不可再变, 可以进行 subscribe, 等待广播
 * 4. TODO: 生命周期处理、多线程并发怎么知道哪个最后触发?
 * 5. 暴露的API?
 */
interface SendData {
  type: string;
  context: any;
  data?: any
}

// status、send、complete、getNowCtx、 subscribe(subscribeFn: (sendData: SendData) => unknown)
type anyFn = (...args: any[]) => unknown

interface Option<C, R> {
  extraEnhancerList?: MiddleWareItem<C, R>[],
  lastMiddleware?: MiddleWareItem<C, R>,
  lastHandle?: unknown;
  errorHandle?: unknown;
}

/**
 * 1. 实例化增强器、lastMiddleware、lastHandle「可以考虑在外部,自由定义」
 * 2. subscribe 观察者、 增强器生命周期
 * 3. 组装好整个运行流程和控制
 * 4. 提前返回和延迟返回
 * 5. ctx
 * 某个解析「默认值、ctx赋值,异步,状态控制, 等待全局状态, tag的处理{对象赋值处理}」
 * @param originEnhancerList 原始增强列表
 * @param param1 最后处理函数、错误处理函数
 */
export const Enhancer = (
  originEnhancerList: MiddleWareItem[] = [],
  {
    lastHandle = (ctx, ...args) => ctx,
    errorHandle = (err) => console.log(err),
  }
) => {
  // 可以添加,也是不稳定的 // 必须确保流程固定或者固定的描述
  const echancerList = [...originEnhancerList];
  const nextListeners: anyFn[] = [];
  let currentListeners: anyFn[] | null = null;
  // let isDispatching =  false

  const subscribe = (listener: anyFn) => {
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
  };

  const broadcast = (sendData: SendData) => {
    currentListeners = nextListeners;
    const listeners = currentListeners;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener(sendData);
    }
  };

  const generateHandle = (context, {
    extraEnhancerList = [],
    lastMiddleware
  }) => {
    // TODO: 标准化处理
    const runTimeFn = [...echancerList.slice(), ...extraEnhancerList];
    const runTimeCtx = typeof context === 'function' ? context() : context;
    const runHandle = asyncCompose(runTimeFn, { broadcast });

    const firstResponse = runHandle(context, lastMiddleware);

    let runingHandle;

    const runTimelastHandle = (firstStepRespone) => {
      runTimeCtx.status = EnhancerHook.end;
      broadcast({
        type: EnhancerHook.end,
        context: runTimeCtx
      });
      return lastHandle(runTimeCtx, firstStepRespone);
    };
    if (firstResponse instanceof Promise) {
      runingHandle = () => firstResponse.then(runTimelastHandle).catch(errorHandle);
    } else {
      runingHandle = () => {
        return new Promise((resolve) => {
          // 周期还是有点不稳定
          subscribe(({ type }) => {
            if (type === 'allResolve') {
              // console.log('enn');
              resolve(runTimelastHandle(runTimeCtx));
            }
          });
        });
      };
    }

    return {
      context: runTimeCtx,
      runingHandle,
      firstResponse
    };
  };

  const addEchancerList = (fnEchancerList: any) => {
    echancerList.push(fnEchancerList);
    return () => {
      const idx = echancerList.indexOf(fnEchancerList);
      return echancerList.splice(idx, 1);
    };
  };

  return {
    generateHandle,
    addEchancerList,
    subscribe
  };
};
