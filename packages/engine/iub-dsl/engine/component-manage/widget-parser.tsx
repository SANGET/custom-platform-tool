import { AllComponentType } from "@iub-dsl/definition";
import { AllUI } from './UI-factory/types';
import { RenderStructInfo, RenderCompInfo } from './component-store/types/renderStruct';

// TODO:: 引入问题
import { normalInputCompParser } from './component-parser/normal-input-parser';
import { normalTableParser } from './component-parser/normal-table-parser';
import { normalButtonParser } from './component-parser/normal-button-parser';

/**
 * 调度对应的组件解析器进行解析
 * @param id IUB_DSL组件ID
 * @param confItem IUB-DSL组件配置
 * @param options 选项
 */
const widgetParseScheduler = (id: string, confItem, options): {
  // 结构和实际数据分离
  renderStructInfo: RenderStructInfo[],
  renderCompInfo: RenderCompInfo
} => {
  const { compType } = confItem;
  switch (compType) {
    case AllComponentType.FormInput:
      return normalInputCompParser(id, confItem, options);
    case AllComponentType.NormalButton:
      return normalButtonParser(id, confItem, options);
    case AllComponentType.NormalTable:
      return normalTableParser(id, confItem, options);
    default:
      return {
        renderCompInfo: {
          [id]: {
            mark: id,
            compTag: AllUI.WidgetError,
            propsKeys: [],
            propsMap: []
          }
        },
        renderStructInfo: [{
          mark: id,
          childrenStructInfo: []
        }]
      };
  }
};

const widgetParser = (conf, options?) => {
  const allCompId = Object.keys(conf);

  const compParseRes: any = {};
  let confItem;
  allCompId.forEach((id) => {
    confItem = conf[id];
    compParseRes[id] = widgetParseScheduler(id, confItem, options);
  });
  return compParseRes;
};

export default widgetParser;
