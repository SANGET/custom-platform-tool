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
  dsl, context, pageContext, appContext
}: ParserParamsOfIUBDSL) => {
  const {
    layoutContent, componentsCollection, actionsCollection,
    metadataMapping, relationshipsCollection, schemas,
    sysRtCxtInterface
  } = dsl;

  // parseMetaData 解析元数据映射，数据转换时调用、使用关系时候调用
  pageContext.metadataEntity = parseMetaData(metadataMapping);
  // schemas 页面渲染解析前调用
  pageContext.store = parseSchemas(schemas);
  // relationshipCollection 任何时候都可能调用
  parseRelation('schemasCreate', relationshipsCollection);
  parsesysInput(sysRtCxtInterface, pageContext.store, pageContext);

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
