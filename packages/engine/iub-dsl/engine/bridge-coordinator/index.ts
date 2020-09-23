/**
 * 桥接协调器
 * 1. 每个使用的地方都有一个独立的协调器
 * 2. 有一个公共标准和各模块进行对接
 * 3. 内部又对外部有一个标准的约束
 * 4. 松耦合,小入侵
 */

const hh = {
  stateManage: {
    set: () => {},
    update: () => {},
  },
  conditionEngine: {
    parser: () => {},
    run: () => {}
  }
};

const Fn = (originHandler, options) => {
  /** 拦截的前置处理 */

  /** 调用时候的函数 */
  return (...params) => {
    /** 仅处理某个参数 */

    // 同步/异步??
    // 中间件??

    /** 处理完的参数 */
    const newParams = params;

    /** 真实处理 */
    const handelerRes = originHandler(...newParams);

    return handelerRes;
  };
};
