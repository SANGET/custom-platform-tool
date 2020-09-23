import { baseInputCompParser as defaultInputParser } from "../component-store/form/input/base-input-parser";
import { globalInputConf, globalDefaultOptions } from "../../conf";

export const baseInputCompParser = (id, conf, options = {}) => {
  return defaultInputParser(id, {
    ...globalInputConf,
    ...conf
  }, {
    ...globalDefaultOptions,
    ...options
  });
};
