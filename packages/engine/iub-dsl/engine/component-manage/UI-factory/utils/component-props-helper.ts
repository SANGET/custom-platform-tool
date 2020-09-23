/**
 * 基础的提取有效的propsKey构造函数
 * TODO: 高级处理
 * 1. 复杂属性映射的处理? 2. 嵌套层级的映射?
 */
export const basePickPropsCstr = (
  basePropsKes: string[]
) => {
  /**
   * 提取有效的PropsKey
   * @param propsKey 需要提取的propsKey
   */
  return function basePickPropsKeyFn(propsKey: string[]): string[] {
    return propsKey.filter((k) => basePropsKes.includes(k));
  };
};

export const basePropsMapCstr = <T>(
  basePropsMapList: { [str: string]: string }
) => {
  /**
   * 重新映射Props
   * @param props 外部输入的props
   * @param propsKeys 所以可以使用的propsKey
   */
  return function basePropsMapFn(props: T, propsKeys: string[]) {
    return propsKeys.reduce((result, key) => {
      // eslint-disable-next-line no-param-reassign
      result[basePropsMapList[key]] = props[key];
      return result;
    }, {});
  };
};
