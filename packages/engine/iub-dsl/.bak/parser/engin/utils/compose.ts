interface Middleware<R = (context, next) => unknown> {
  // 这个Key怎能写来着?
  (...arg: any[]): R
}

interface AsyncMiddleware<C, R> {
  (context: C, next: () => Promise<R>): R
}

/**
 * 洋葱皮结构的中间件机制
 * @param {Array} middleware 中间件数组
 * @returns {Function}
 * @api public
 */
export const asyncCompose = <C, R = void>(middleware: AsyncMiddleware<C, R>[]) => {
  /**
   * @param context 中间件调用的上下文
   * @param next 最后一个中间件, 也是异步开始的第一中间件, 所以 Promise.resolve(); 第一个res为undefined;
   *              而有其中一个中间件没有调用next的话,则从没有当时的中间件进行往回调用
   */
  return (context: C, next: AsyncMiddleware<C, void>) => {
    let index = -1;
    return dispatch(0);
    function dispatch(i: number) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times 「next被多次调用」'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next; // TODO: 类型怎么写来着?
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
};
export const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  // return funcs.reduce((a, b) => (...args) => a(b(...args)));
  return funcs.reduce((a, b) => {
    console.log(a);
    console.log(b);

    return (...args) => {
      console.log(args);

      return a(b(...args));
    };
  });
};
