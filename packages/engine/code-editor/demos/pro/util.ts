const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
/**
 * 获取 function 里面的参数
 * @param func
 * @return string[]
 */
export function getFuncParamNames(func: string): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  return result || [];
}
/**
 * 比较两个 类型 值是否相等
 * @export
 * @param {*} x
 * @param {*} y
 * @returns boolean
 */
export function equals(x: any, y: any) {
  const f1 = x instanceof Object;
  const f2 = y instanceof Object;
  if (!f1 || !f2) {
    return x === y;
  }
  if (Object.keys(x).length !== Object.keys(y).length) {
    return false;
  }
  const newX = Object.keys(x);
  for (let p in newX) {
    p = newX[p];
    const a = x[p] instanceof Object;
    const b = y[p] instanceof Object;
    if (a && b) {
      equals(x[p], y[p]);
    } else if (x[p] !== y[p]) {
      return false;
    }
  }
  return true;
}
/**
 * 除去代码片段里面注释
 * @param codes
 */
export function removeComments(codes: string): string {
  const reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n|$))|(\/\*(\n|.)*?\*\/)/g;
  return codes.replace(reg, (word: string) => {
    return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
  }).trim();
}

/**
 * 获取代码块
 * @param script
 */
export function getFuncBody(script: string) {
  const code = removeComments(script);
  return code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
}
