import {
  FullRenderStruct, BaseRenderStruct, GenRenderStructContext, CompPropsMap, RenderStructInfo
} from "../types/renderStruct";
import {
  pickCanUseCompPropsKey, genCompPropsMapList, genCompPropsMapList3, propContextHandle, propsParser as originPropsParser
} from "./props-parser";

const tempCode = (compTag) => {
  if (compTag === 'Tootip') {
    return Math.random() > 0.3;
  }
  return true;
};

const arrayRenderStructParser = (...args) => {};

/**
 * TODO: 目前仅考虑一层的
 * 1. 期待配置的key是 string[一级]
 * 2. 如果涉及多层, 再扩展考虑, 再进行路径考虑
 * 3. 设计多层的conf, 也可能参与递归
 */

const genRenderStructList = (
  renderStruct: FullRenderStruct[],
  genRenderStructContext: GenRenderStructContext,
  widgetParserOptions = {},
) => {
  const structLength = renderStruct.length;
  for (let i = 0; i < structLength; i++) {
    genRenderStructContext.index = i;
    genRenderStruct(renderStruct[i], genRenderStructContext, widgetParserOptions);
  }
};

/** 处理函数可以不一样, 但是传参数和上下文是固定的标准 */
const genRenderStruct = (
  renderStructItem: FullRenderStruct,
  genRenderStructContext: GenRenderStructContext,
  widgetParserOptions
) => {
  switch (renderStructItem.type) {
    case 'BaseRenderStruct':
      return genBaseRenderStruct(renderStructItem, genRenderStructContext, widgetParserOptions);
    case 'ArrayRenderStruct':
      return arrayRenderStructParser(renderStructItem, genRenderStructContext, widgetParserOptions);
    default:
      console.error('类型有错');
      return null;
  }
};

/**
  * 基础渲染结构的解析器
  * @param structItem BaseRenderStruct
  * @param genRenderStructContext 上下文
  */
const genBaseRenderStruct = (
  structItem: BaseRenderStruct,
  genRenderStructContext: GenRenderStructContext,
  widgetParserOptions
) => {
  const {
    baseMark,
    allConfKey,
    originConf,
    renderCompInfo,
    renderStructInfo,
    index
  } = genRenderStructContext;

  const {
    canUseProps, compTag, canSkip, requireRender
  } = structItem;
  // TODO: 严重问题, ctx透传很深
  const {
    parseContext = {}
  } = widgetParserOptions;
  let {
    propsParser = originPropsParser
  } = parseContext;
  if (propsParser !== originPropsParser) {
    propsParser = propsParser(originPropsParser, {
      getStructItemInfo: (key) => structItem[key] || structItem,
    });
  }

  const mark = `${baseMark}-${compTag}${index}`;
  const usePropsKeys = pickCanUseCompPropsKey(canUseProps)(allConfKey);

  const propsParseRes = {
    staticProps: {},
    dynamicProps: {}
  };

  genCompPropsMapList3(usePropsKeys, {
    genPropsMap: (key: string, ctx) => {
      const conf = originConf[key]; // getConfFn
      propContextHandle(propsParser(key, conf), ctx);
    }
  }, propsParseRes);

  // Old
  /** 演示临时代码 */
  let compPropsMapList: CompPropsMap[] = [];
  if (tempCode(compTag)) {
    compPropsMapList = genCompPropsMapList(usePropsKeys, originConf);
  } else {
    console.log('没有渲染tip: ', mark);
  }

  if (compPropsMapList.length || requireRender) {
    const childrenStructInfo = [];
    const renderStructInfoItem: RenderStructInfo = {
      mark,
      childrenStructInfo
    };

    renderStructInfo.push(renderStructInfoItem);

    genRenderStructContext.baseMark = mark;
    genRenderStructContext.renderStructInfo = childrenStructInfo;
    renderCompInfo[mark] = {
      ...propsParseRes,
      mark,
      compTag,
      propsKeys: usePropsKeys,
      propsMap: compPropsMapList,
    };
  } else if (!canSkip) return;

  genChildrenRenderStruct<BaseRenderStruct>(structItem, genRenderStructContext, widgetParserOptions);
};

const genChildrenRenderStruct = <T extends FullRenderStruct>(
  structItem: T,
  genRenderStructContext: GenRenderStructContext,
  widgetParserOptions
) => {
  /** e.g.条件处理引擎处理, 是否渲染子级结构 */

  const { children } = structItem;

  if (children?.length) {
    genRenderStructList(children, genRenderStructContext, widgetParserOptions);
  }
};

export {
  genRenderStructList
};
