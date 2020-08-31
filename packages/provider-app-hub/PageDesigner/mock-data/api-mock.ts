/**
 * 假装是通过 API 获取数据的 HOC
 */
export const ApiMock = (data) => () => {
  return new Promise((resolve) => {
    resolve(data);
  });
};
