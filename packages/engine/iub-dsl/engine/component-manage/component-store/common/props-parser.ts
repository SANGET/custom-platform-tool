import { CompPropsMap } from "../types";

/** 提取某个组件可以使用的props */
const pickCanUseCompPropsKey = (
  canUsePropsKeys: string[]
) => (
  compPropsKeys: string[]
): string[] => {
  return canUsePropsKeys.filter((k) => compPropsKeys.includes(k));
};

const dynamicType = ['dynamicProps', 'widgetEvent'];
/** props处理的结果约定 */
export const propContextHandle = (result, context) => {
  const { type, result: actralResult } = result;

  const { staticProps, dynamicProps } = context;

  if (dynamicType.includes(type)) {
    context.dynamicProps = {
      ...dynamicProps,
      ...actralResult
    };
  } else {
    context.staticProps = {
      ...staticProps,
      ...result
    };
  }
};

const genCompPropsMap = (key, propsConf) => ({ key, val: propsConf });

const propsParser = (key, val) => ({ [key]: val });

/** TODO: 正在解决
 * 1. 仅针对单层处理, 是否缓存处理
 * 2. 公用参数
 * 3. key/value这个标准
 * 4. 包装代理处理
 * 5. 处理完,如何知道使用的时候呢?
 * 6. 像第2层的action呢?
 */
const genCompPropsMapList = (
  usePropsKeys: string[], conf: any
) => usePropsKeys.map((key) => genCompPropsMap(key, conf[key]));

const genCompPropsMapList3 = (
  usePropsKeys: string[],
  { genPropsMap },
  context
) => {
  const l = usePropsKeys.length;
  for (let i = 0; i < l; i++) {
    genPropsMap(usePropsKeys[i], context);
  }
  return context;
};

const genPropsMap = (key, propsConf, context) => {

};

export {
  pickCanUseCompPropsKey,
  genCompPropsMap,
  genCompPropsMapList,
  genCompPropsMapList3,
  propsParser
};
