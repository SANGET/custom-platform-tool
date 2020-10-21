import { AllUI } from "@iub-dsl/engine/component-manage/UI-factory/types";
import {
  FullRenderStruct, BaseRenderStruct, CommonRenderStructParser, RenderCompInfo, RenderStructInfo
} from "../../types/renderStruct";
import { fromItemKes, toolTipPropsKes, normalInputPropsKeys } from "../../../UI-factory";
import { genRenderStructList } from "../../common/render-struct-parser";

/** 一个表单输入框组件最多可以渲染多少个widget,
 * 1. 最好是一层
 * 2. 有引用关系,拿到数据就知道, 需要配置平台业务配合
 * */
export const genNormalInputFullRenderStruct = () => {
  /** TODO: 业务沉淀后再提取公共结构 */
  const baseInutFullRenderStruct: FullRenderStruct[] = [
    {
      compTag: AllUI.FormItem,
      type: 'BaseRenderStruct',
      canSkip: true,
      /** 某个特定的结构, 所需要的props特定 */
      canUseProps: fromItemKes,
      children: [
        {
          // type: 'ArrayRenderStruct',
          // canUseCompList: [
          //   {
          //     compTag: AllUI.Tootip,
          //     canUseProps: toolTipPropsKes,
          //     canSkip: true,
          //   }
          // ],
          type: 'BaseRenderStruct',
          compTag: AllUI.Tootip,
          canUseProps: toolTipPropsKes,
          canSkip: true,
          children: [
            {
              type: 'BaseRenderStruct',
              compTag: AllUI.NormalInput,
              canUseProps: normalInputPropsKeys,
              requireRender: true,
              canSkip: false,
            }
          ]
        },
      ]
    }
  ];
  return baseInutFullRenderStruct;
};

/**
 * 检查最大可渲染的结构, 生成可以直接渲染的配置
 * @params options
 */
export const normalInputRenderStructParser = (
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
    index: -1,
  },
  widgetParserOptions);

  return {
    renderStructInfo,
    renderCompInfo
  };
};
