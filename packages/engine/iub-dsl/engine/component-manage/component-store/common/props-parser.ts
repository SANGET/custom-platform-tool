/** 提取某个组件可以使用的props */
const pickCanUseCompPropsKey = (
  canUsePropsKeys: string[]
) => (
  compPropsKeys: string[]
): string[] => {
  return canUsePropsKeys.filter((k) => compPropsKeys.includes(k));
};

const genCompPropsMap = ({ key, propsConf }) => ({ key, val: propsConf });

/** TODO: 正在解决
 * 1. 仅针对单层处理, 是否缓存处理
 * 2. 公用参数
 * 3. key/value这个标准
 * 4. 包装代理处理
 * 5. 处理完,如何知道使用的时候呢?
 */
const genCompPropsMapList = (
  usePropsKeys: string[], conf: any
) => usePropsKeys.map((key) => genCompPropsMap({ key, propsConf: conf[key] }));

export {
  pickCanUseCompPropsKey,
  genCompPropsMap,
  genCompPropsMapList
};
