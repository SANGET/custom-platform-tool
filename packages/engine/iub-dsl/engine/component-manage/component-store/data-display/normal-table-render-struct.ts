import { AllUI } from "@iub-dsl/engine/component-manage/UI-factory/types";
import {
  FullRenderStruct, ActualRenderInfo, BaseRenderStruct, CommonRenderStructParser
} from "../types";
import { normalTablePropsKes } from "../../UI-factory";
import { genRenderStructList } from "../common/render-struct-parser";

/** 一个表单输入框组件最多可以渲染多少个widget,
 * 1. 最好是一层
 * 2. 有引用关系,拿到数据就知道, 需要配置平台业务配合
 * */
export const genNormalTableFullRenderStruct = () => {
  /** TODO: 业务沉淀后再提取公共结构 */
  const normalTableFullRenderStruct: FullRenderStruct[] = [
    {
      compTag: AllUI.NormalTable,
      type: 'BaseRenderStruct',
      canSkip: true,
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
  // TODO: 未确定
  options: CommonRenderStructParser
): ActualRenderInfo[] => {
  const {
    allConfKey,
    originConf,
    baseMark
  } = options;
  const normalTableActualRenderInfo: ActualRenderInfo[] = [];
  genRenderStructList(fullRenderStruct, {
    allConfKey,
    originConf,
    baseMark,
    actualRenderInfo: normalTableActualRenderInfo
  });

  return normalTableActualRenderInfo;
};
