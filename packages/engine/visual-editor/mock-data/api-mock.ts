/**
 * 假装是通过 API 获取数据的 HOC
 */
export const ApiMock = <T>(data: T) => () => {
  return new Promise<T>((resolve) => {
    resolve(data);
  });
};
