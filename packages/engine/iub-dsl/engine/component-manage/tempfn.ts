import React, {
  useState, useEffect, useMemo, useLayoutEffect
} from 'react';

export const asyncResolve = (resVal, time = 1) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    resolve(resVal);
    clearTimeout(timer);
  }, time * 1000);
});
interface PropHandle {
  (props: any, { result: any }): any
}
const originPropHandle: PropHandle = (props, { result }) => {
  const { key, val } = props;
  result[key] = val; // TODO
  return { [key]: val };
};

const originPropsListHandle = (
  propsMapList: any[],
  { propHandle }, // options
  context
) => {
  const l = propsMapList.length;
  for (let i = 0; i < l; i++) {
    propHandle(propsMapList[i], context);
  }
};

export const useCompProps = (propsMap) => {
  /** 额外代码 */
  const aopContext = {
    asyncHandle: [] as Promise<any>[],
    asyncNum: 0,
  };
  const context = {
    result: {}
  };
  /** 额外代码 */
  const enhancePropHandle = propHandleWrap(originPropHandle, aopContext);

  originPropsListHandle(propsMap, { propHandle: enhancePropHandle }, context);

  const [tempCompProps, setCompProps] = useState(context.result || {});

  /** 额外代码 - 观察变化的 */
  useEffect(() => {
    aopContext.asyncHandle.forEach((promise) => promise.then((newProps) => {
      setCompProps({
        ...tempCompProps,
        ...newProps
      });
    }));
  }, []);

  return {
    compProps: useMemo(() => {
      return tempCompProps;
    }, [tempCompProps]),
    setCompProps
  };
};

const propHandleWrap = (originHandle, context, options?) => {
  /** 拦截的前置处理 */

  /** 调用时候的函数 */
  return ({ key, val }, ctx) => {
    /** 仅处理某个参数 */

    // TODO: 正常不应该影响input的渲染「待查到问题优化」
    if (key === 'label' && Math.random() > 0.3) {
      context.asyncHandle.push(asyncResolve(
        originHandle({
          key, val: '异步文本'
        }, ctx)
      ));
    }

    /** 处理完的参数 */

    /** 真实处理 */
    const handelerRes = originHandle({ key, val }, ctx);

    return handelerRes;
  };
};

/**
 * 1. 对属性列表的处理, 返回结果
 * 2. 可以知道结果在这层? 问题是调用方需要相应
 *
 * 1. 对propHandle处理的增强
 * 2. 与之对应需要在, 赋值的时候, 实现对增强结果的监听
 */
