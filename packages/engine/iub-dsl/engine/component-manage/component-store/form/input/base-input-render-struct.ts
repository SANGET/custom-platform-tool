import { AllUI } from "../../../UI-factory/types/all-UI";
import { FullRenderStruct, ActualRenderStruct } from "../../types/renderStruct";
import { fromItemKes, toolTipPropsKes, baseInputPropsKes } from "../../../UI-factory";

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

interface CommonRenderStructParser extends CommonRenderStructParseRes {
  allConfKey: string[]
  originConf: any;
  baseMark: string
  struct: FullRenderStruct[]
}
interface CommonRenderStructParseRes {
  renderStruct: ActualRenderStruct[]
  compPropsList: {
    [mark: string]: CompPropsStruct[]
  }
}

export interface CompPropsStruct<T = any> {
  key: string;
  val: T
}

/** TODO: 仅针对单层处理, 是否缓存处理 */
const getValidCompProps = (
  compPropsKeys: string[], originConf,
  // ) => (
  canUsePropsKeys: string[]
) => {
  const result: CompPropsStruct[] = [];
  canUsePropsKeys.forEach((propKey) => {
    if (compPropsKeys.includes(propKey)) {
      result.push({
        key: propKey,
        val: originConf[propKey]
      });
    }
  });
  return result;
};

/**
 * TODO: 目前仅考虑一层的
 * 1. 期待配置的key是 string[一级]
 * 2. 如果涉及多层, 再扩展考虑, 再进行路径考虑
 * 3. 设计多层的conf, 也可能参与递归
 */

export const baseInputRenderStructParser = (
  options: CommonRenderStructParser
): CommonRenderStructParseRes => {
  const {
    allConfKey,
    originConf,
    baseMark,
    struct,
    renderStruct,
    compPropsList
  } = options;
  const result: CommonRenderStructParseRes = {
    renderStruct,
    compPropsList
  };

  struct.forEach((structItem, index) => {
    try {
      // TODO: 有问题的函数
      if (structItem.type === 'BaseRenderStruct') {
        const {
          canUseProps, compTag, canSkip, children
        } = structItem;
        const mark = `${baseMark}-${compTag}${index}`;
        const onceCompPropsList = getValidCompProps(allConfKey, originConf, canUseProps);
        if (onceCompPropsList.length) {
          const newRenderStruct = [];
          renderStruct.push({
            compTag,
            mark,
            renderStruct: newRenderStruct
          });
          // eslint-disable-next-line no-param-reassign
          compPropsList[mark] = onceCompPropsList;
          children?.length && baseInputRenderStructParser({
            ...options,
            baseMark: mark,
            struct: children,
            renderStruct: newRenderStruct,
          });
          return;
        }
        if (canSkip && children?.length) {
          baseInputRenderStructParser({
            ...options,
            baseMark: mark,
            struct: children,
          });
        }
      } else if (structItem.type === 'ArrayRenderStruct') {
        // TODO: 这个结构不好维护, 现在还没想好, 更好的结构
        // const {
        //   canUseCompList, children, isloop
        // } = structItem;
        // canUseCompList[isloop ? 'forEach' : 'every']((info) => {
        //   const {
        //     canUseProps, compTag, canSkip
        //   } = info;
        //   const mark = `${baseMark}-${compTag}+${index}`;
        //   const onceCompPropsList = getValidCompProps(allConfKey, originConf, canUseProps);
        //   if (onceCompPropsList.length) {
        //     const newRenderStruct = [];
        //     renderStruct.push({
        //       compTag,
        //       mark,
        //       renderStruct: newRenderStruct
        //     });
        //     // eslint-disable-next-line no-param-reassign
        //     compPropsList[mark] = onceCompPropsList;
        //   }
        // });
      }
    } catch (e) {
      console.warn(e);
    }
  });

  return result;
};

// switch (type) {
//   case 'BaseRenderStruct':
//     break;
//   case 'ArrayRenderStruct':
//     break;
//   default:
//     break;
// }
