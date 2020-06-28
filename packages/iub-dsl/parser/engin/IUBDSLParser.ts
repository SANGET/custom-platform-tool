import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import LayoutParser from "./layout";
import flowExecutor from "./flow";
import parseMetaData from "./mapping/metaData";

/**
 * 1. 页面运行上下文的生成、数据仓库、
 * 2. 事件绑定的时机？
 * 3.
 */

const parseSchemas = () => {};
const parsesysInput = () => {};
const parsesysOutput = () => {};

const IUBDSLParser = ({
  dsl, context
}: ParserParamsOfIUBDSL) => {
  const {
    layoutContent, componentsCollection, actionsCollection,
    metadataMapping, relationshipsCollection, schemas,
    sysRtCxtInterface
  } = dsl;

  // metadataParse 解析元数据映射，数据转换时调用、使用关系时候调用

  // relationshipCollection 任何时候都可能调用

  // schemas 页面渲染解析前调用

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
  switch (layoutContent.type) {
    case 'general':
      // TODO: 订阅其他页面的数据变化
      // context.subscribeDataChange(sysRtCxtInterface);
      return LayoutParser({
        layoutNode: layoutContent.content,
      }, parserContext);
    case 'custom':
      return '';
    default:
      break;
  }
};

// const IUBDSLParser = ({
//   dsl,
//   context,
// }: ParserParamsOfIUBDSL) => {
//   const {
//     layoutContent, componentsCollection, actionsCollection,
//     metadataMapping, relationshipsCollection, schemas,
//     sysRtCxtInterface
//   } = dsl;
//   const metaDataMapping = parseMetaData();
//   // 实际的数据引入、sys系统引用
//   parsesysInput();
//   parseSchemas();
//   const parserContext = {
//     context,
//     metaDataMapping,
//     bindAction: (actionID) => {
//       // console.log(actionID);
//       return actionsCollection[actionID];
//     },
//     bindComponent: (componentID) => {
//       // console.log(componentID);
//       return componentsCollection[componentID];
//     },
//   };
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
// };

export default IUBDSLParser;

// 行为与表现分离
