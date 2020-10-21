import { normalButtonParser as defaultButtonParser } from "../component-store";
import { globalInputConf, globalDefaultOptions } from "../../conf";

/**
 * 解析组件入口, 需要merge其他选择
 * @param id 组件唯一ID
 * @param conf 组件配置
 * @param options 解析选项
 */
export const normalButtonParser = (id: string, conf = {}, options = {}) => {
  return defaultButtonParser(id, {
    ...globalInputConf,
    ...conf
  }, {
    ...globalDefaultOptions,
    ...options
  });
};
