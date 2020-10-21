import { normalInputCompParser as defaultInputParser } from "../component-store";
import { globalInputConf, globalDefaultOptions } from "../../conf";

/**
 * 解析组件入口, 需要merge其他选择
 * e.g.: 表单类型的组件, 在页面状态为detail时,显示为纯文本. 此业务逻辑应该是全局配置
 * @param id 组件唯一ID
 * @param conf 组件配置
 * @param options 解析选项
 */
export const normalInputCompParser = (id: string, conf = {}, options = {}) => {
  return defaultInputParser(id, {
    ...globalInputConf,
    ...conf
  }, {
    ...globalDefaultOptions,
    ...options
  });
};
