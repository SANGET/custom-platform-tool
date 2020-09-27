import {
  FullRenderStruct, ActualRenderInfo, BaseRenderStruct, genRenderStructListContext, CompPropsMap
} from "../types/renderStruct";
import { pickCanUseCompPropsKey, genCompPropsMapList } from "./props-parser";

const arrayRenderStructParser = (...args) => {};

/**
 * TODO: 目前仅考虑一层的
 * 1. 期待配置的key是 string[一级]
 * 2. 如果涉及多层, 再扩展考虑, 再进行路径考虑
 * 3. 设计多层的conf, 也可能参与递归
 */

const genRenderStructList = (
  renderStruct: FullRenderStruct[],
  context: genRenderStructListContext,
  options = {},
) => {
  const structLength = renderStruct.length;
  for (let i = 0; i < structLength; i++) {
    genRenderStruct(renderStruct[i], i, context);
  }
};

/** 处理函数可以不一样, 但是传参数和上下文是固定的标准 */
const genRenderStruct = (
  renderStructItem: FullRenderStruct,
  index: number,
  context: genRenderStructListContext,
) => {
  switch (renderStructItem.type) {
    case 'BaseRenderStruct':
      return genBaseRenderStruct(renderStructItem, context, { index });
    case 'ArrayRenderStruct':
      return arrayRenderStructParser(renderStructItem, context, { index });
    default:
      console.error('类型有错');
      return null;
  }
};

/**
  * 基础渲染结构的解析器
  * @param structItem BaseRenderStruct
  * @param context 上下文
  */
const genBaseRenderStruct = (
  structItem: BaseRenderStruct,
  context: genRenderStructListContext,
  { index }: {index: number}
) => {
  const {
    baseMark,
    allConfKey,
    originConf,
    actualRenderInfo
  } = context;

  const {
    canUseProps, compTag, canSkip
  } = structItem;

  const mark = `${baseMark}-${compTag}${index}`;
  const usePropsKeys = pickCanUseCompPropsKey(canUseProps)(allConfKey);
  const compPropsMapList: CompPropsMap[] = genCompPropsMapList(usePropsKeys, originConf);

  if (compPropsMapList.length) {
    const newActualRenderInfo = [];
    const renderInfoItem: ActualRenderInfo = {
      compTag,
      mark,
      propsKeys: usePropsKeys,
      propsMap: compPropsMapList,
      renderStruct: newActualRenderInfo
    };

    actualRenderInfo.push(renderInfoItem);

    context.baseMark = mark;
    context.actualRenderInfo = newActualRenderInfo;
  } else if (!canSkip) return;

  genChildrenRenderStruct<BaseRenderStruct>(structItem, context, { index });
};

const genChildrenRenderStruct = <T extends FullRenderStruct>(
  structItem: T,
  context,
  { index }: { index: number }
) => {
  const { children } = structItem;

  if (children?.length) {
    genRenderStructList(children, context);
  }
};

export {
  genRenderStructList
};
