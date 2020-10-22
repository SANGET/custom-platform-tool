interface ArrayAsyncHandleOptions {
  handle: (...args) => any;
  handleExtralParam?: any[];
}

/**
 * 将数组的异步处理, 封装成递归处理
 * @param originArr 需要处理的数组
 * @param 选择 「处理函数, 处理的的外参数」
 * @method handle 第一个参数默认为数组某项的值
 */
export const arrayAsyncHandle = async <R = any>(originArr: any[], {
  handle,
  handleExtralParam = []
}: ArrayAsyncHandleOptions) => {
  /** 复制数组 */
  const needHandleArr = originArr.slice();
  /** 定义结果 */
  const result: R[] = [];
  /** 定义递归函数 */
  const recursivelyFn = async () => {
    const val = needHandleArr.shift();
    const handleRes = await handle(val, ...handleExtralParam);
    /** 仅添加有返回的结果 */
    if (handleRes !== undefined) {
      result.push(handleRes);
    }
    if (needHandleArr.length) {
      /** 递归 */
      await recursivelyFn();
    }
  };
  /** 运行 */
  await recursivelyFn();
  return result;
};

// export const asyncMap = async (originArr: any[], handle) => {
//   const needHandleArr = originArr.slice();
//   const result: R[] = [];
// }
