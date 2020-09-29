import { AllUI } from "../../../UI-factory/types/all-UI";
import {
  FullRenderStruct, ActualRenderInfo, BaseRenderStruct, CommonRenderStructParser
} from "../../types/renderStruct";
import { fromItemKes, toolTipPropsKes, baseInputPropsKes } from "../../../UI-factory";
import { genRenderStructList } from "../../common/render-struct-parser";

/** 一个表单输入框组件最多可以渲染多少个widget,
 * 1. 最好是一层
 * 2. 有引用关系,拿到数据就知道, 需要配置平台业务配合
 * */
export const genBaseInputFullRenderStruct = () => {
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
              compTag: AllUI.BaseInput,
              canUseProps: baseInputPropsKes,
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
export const baseInputRenderStructParser = (
  fullRenderStruct,
  // TODO: 未确定
  options: CommonRenderStructParser
): ActualRenderInfo[] => {
  const {
    allConfKey,
    originConf,
    baseMark
  } = options;
  const baseInputActualRenderInfo: ActualRenderInfo[] = [];
  genRenderStructList(fullRenderStruct, {
    allConfKey,
    originConf,
    baseMark,
    actualRenderInfo: baseInputActualRenderInfo
  });

  return baseInputActualRenderInfo;
};
