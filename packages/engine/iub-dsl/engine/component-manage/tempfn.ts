export const asyncResolve = (resVal, time = 1) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    resolve(resVal);
    clearTimeout(timer);
  }, time * 1000);
});

const propHandleWrap = (originHandle, context, options?) => {
  /** 拦截的前置处理 */

  /** 调用时候的函数 */
  return ({ key, val }) => {
    /** 仅处理某个参数 */

    if (key === 'label' && Math.random() > 0.3) {
      context.async.push(asyncResolve(
        originHandle({
          key, val: '异步文本'
        })
      ));
    }

    /** 处理完的参数 */

    /** 真实处理 */
    const handelerRes = originHandle({ key, val });

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
export const handlePropsList = (list) => {
  /** 测试代码: 最大调用方实现 */
  const ctx = {
    async: [] as Promise<any>[],
    needAsync: 0,
  };
  let result = {};
  const propHandle = ({ key, val }) => {
    return { [key]: val };
  };
  // async 是针对propHandle的ctx字段
  const enhancePropHandle = propHandleWrap(propHandle, ctx); // wrap定义ctx至少有什么

  const resultPropsHandle = (props) => {
    const propRes = enhancePropHandle(props);
    result = {
      ...result,
      ...propRes
    };
    // 增强部分、在这一层可以知道路径
    /** 测试代码: 这部分代码应该由最外层调用方实现 */
    if (ctx.async.length > ctx.needAsync) {
      ctx.async[ctx.async.length - 1].then((newRes) => {
        result = {
          ...result,
          ...newRes,
        };
        console.log(result);
      });
      ctx.needAsync++;
    }
  };

  const actralPropHandle = resultPropsHandle;

  const propsMapListHandle = (
    propsMapList: any[]
  ) => {
    const l = propsMapList.length;
    for (let i = 0; i < l; i++) {
      actralPropHandle(propsMapList[i]);
    }
  };

  propsMapListHandle(list);

  return result;
};
