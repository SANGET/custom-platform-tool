import { AllUI } from "@iub-dsl/engine/component-manage/UI-factory/types";
import {
  FullRenderStruct, CommonRenderStructParser, RenderStructInfo, RenderCompInfo
} from "../types";
import { normalTablePropsKes } from "../../UI-factory";
import { genRenderStructList } from "../common/render-struct-parser";

export const genNormalTableFullRenderStruct = () => {
  /** TODO: 业务沉淀后再提取公共结构 */
  const normalTableFullRenderStruct: FullRenderStruct[] = [
    {
      compTag: AllUI.NormalTable,
      type: 'BaseRenderStruct',
      canSkip: true,
      requireRender: true,
      /** 某个特定的结构, 所需要的props特定 */
      canUseProps: normalTablePropsKes,
      children: []
    }
  ];
  return normalTableFullRenderStruct;
};

/**
 * 检查最大可渲染的结构, 生成可以直接渲染的配置
 * @params options
 */
export const normalTableRenderStructParser = (
  fullRenderStruct,
  widgetConf: CommonRenderStructParser,
  widgetParserOptions?
): {
  // 结构和实际数据分离
  renderStructInfo: RenderStructInfo[],
  renderCompInfo: RenderCompInfo
} => {
  const {
    allConfKey,
    originConf,
    baseMark
  } = widgetConf;
  const renderStructInfo: RenderStructInfo[] = [];
  const renderCompInfo: RenderCompInfo = {};
  genRenderStructList(fullRenderStruct, {
    allConfKey,
    originConf,
    baseMark,
    renderStructInfo,
    renderCompInfo,
    index: -1
  },
  widgetParserOptions);

  return {
    renderStructInfo,
    renderCompInfo
  };
};
