/**
 * 假装是通过 API 获取数据的 HOC
 */
export const ApiMock = <T>(data: T) => (): Promise<T> => {
  return new Promise((resolve) => {
    resolve(data);
  });
};
