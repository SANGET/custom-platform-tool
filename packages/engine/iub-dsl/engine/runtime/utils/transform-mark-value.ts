/**
 * @description 转换含有特殊标示的字符串
 */

import { isPageState } from "../../state-manage";

interface TransformCtx {
  getPageState: any
}

/**
 * 将含有特殊标示的值进行转换转换值
 * @example @(schemas).dId1 将获取页面数据中dId1的值
 * @param value 需要被转换的值
 * @param ctx 上下文
 */
const transformMarkValue = (value: string, ctx: TransformCtx) => {
  const { getPageState } = ctx;
  if (isPageState(value)) {
    return getPageState(value);
  }
  return value;
};

/**
 * @method transformMarkValuesFormArray 将特殊标示的值的数组进行转换
 * @name transMarkValFromArr 方法名缩写
 * @param values 需要被转换的值数组
 * @param ctx 上下文
 */
export const transMarkValFromArr = (values: string[], ctx: TransformCtx) => {
  return values.map((v) => transformMarkValue(v, ctx));
};

/**
 * @description 背景, 后端说传空字符串也生效是没问题的, 所以需要过滤
 * @method validTransformMarkValueFromArray 验证值数组是否为空
 * @name validTransMarkValFromArr 方法名缩写
 * @param values 需要被验证的值的数组
 */
export const validTransMarkValFromArr = (values: string[]) => {
  const isVaild = values.every((v) => v);
  return isVaild ? values : false;
};
