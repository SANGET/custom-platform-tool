export interface ICommonStruct {
  [str: string]: string | string[] | ICommonStruct;
}

const unexpectedStructHandle = (struct: IStructParam, key?: string | number) => false;

export type IStructParam = string | (string | ICommonStruct)[] | ICommonStruct

const structHandle = (struct: IStructParam, handle) => {
  if (typeof struct === 'string') {
    return handle(struct);
  }

  if (Array.isArray(struct)) {
    return struct.map(
      (_, i) => (_ !== undefined ? structHandle(_, handle) : unexpectedStructHandle(struct, i))
    );
  }

  if (typeof struct === 'object') {
    return Object.keys(struct).reduce((res, key) => {
      if (struct[key] !== undefined) {
        res[key] = structHandle(struct[key], handle);
      } else {
        res[key] = unexpectedStructHandle(struct, key);
      }
      return res;
    }, {});
  }

  return unexpectedStructHandle(struct);
};

// enhancer

export interface DefaultConf<T = () => ''> {
  before?: (struct: IStructParam) => IStructParam;
  after?: (transformRes, struct: IStructParam) => unknown
  handle: T;
}

// 普通函数和箭头函数对比
// export function commonStructTransform<T>(structParam: IStructParam, config: DefaultConf<T>) {
export const commonStructTransform = <T>(structParam: IStructParam, config: DefaultConf<T>) => {
  let struct: IStructParam = structParam;
  if (config.before) {
    struct = config.before(structParam);
  }

  let transformRes = structHandle(struct, config.handle);

  if (config.after) {
    transformRes = config.after(transformRes, struct);
  }

  return transformRes;
};

/**
 * TODO:
 * 1. 主要针对structString处理
 * 2. before、after钩子
 * 3、不同的struct就是不同的loader
 * 4、插件?
 * 5、最深层级
 */
