import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import LayoutParser from "./layout";
import flowExecutor from "./flow";
import parseMetaData from "./meta-data/metaData";
import { parseRelation } from "./relation";

/**
 * 1. 页面运行上下文的生成、数据仓库、
 * 2. 事件绑定的时机？
 * 3. 每个时机都是可以独立解析的，可以使用接口反射  ??
 * 4. 绑定数据的时刻、钩子、反射？
 */

const parseSchemas = (...args) => {};
const parsesysInput = (...args) => {};
const parsesysOutput = (...args) => {};

const IUBDSLParser = ({
  dsl, context
}: ParserParamsOfIUBDSL) => {
  const {
    layoutContent, componentsCollection, actionsCollection,
    metadataMapping, relationshipsCollection, schemas,
    sysRtCxtInterface
  } = dsl;

  const result: { [str: string]: unknown } = {};

  // parseMetaData 解析元数据映射，数据转换时调用、使用关系时候调用
  result.metadataEntity = parseMetaData(metadataMapping);
  // schemas 页面渲染解析前调用
  result.store = parseSchemas(schemas);
  // relationshipCollection 任何时候都可能调用
  parseRelation('schemasCreate', relationshipsCollection);
  parsesysInput(sysRtCxtInterface, result);

  // 每个解析器都是独立的，应该是外部需要调用的时候直接调用，根据解析器需要的参数
  // 而解析器相互之间是存在依赖的，
  // context贯穿所有解析器，相互依赖。相互取用，利用context来解决依赖和耦合

  // 想法
  // 1. 解析器能够独立调用。使用的应该是依赖注入
  // 2. 外部应该也不需要关心解析器所需要的上下文，应该是独立的职能。
  // 3. 如果用上下文贯穿应该也是有问题的？？？举例子。或者说上下文如何做到解偶

  // 内部定义Interfance标准，外部传入？

  // 内部不需要知道参数，外部传入，内部用方法获取
  const parserContext = {
    context,
    // metaDataMapping,
    bindAction: (actionID) => {
      // console.log(actionID);
      return actionsCollection[actionID];
    },
    bindComponent: (componentID) => {
      // console.log(componentID);
      return componentsCollection[componentID];
    },
  };

  try {
    // TODO: general / custom
    return LayoutParser({
      layoutNode: layoutContent.content
    }, parserContext);
  } catch (e) {
    return '';
  } finally {
    parsesysOutput();
  }
};

//   try {
//     switch (layoutContent.type) {
//       case 'general':
//         // TODO: 订阅其他页面的数据变化
//         // context.subscribeDataChange(sysRtCxtInterface);
//         return layoutParser({
//           layoutNode: layoutContent,
//         }, parserContext);
//       case 'custom':
//         return '';
//       default:
//         return '';
//     }
//   } catch (e) {
//     return 'error';
//   } finally {
//     parsesysOutput();
//   }

export default IUBDSLParser;

// 行为与表现分离
