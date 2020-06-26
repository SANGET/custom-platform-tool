import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import layoutParser from "./layout";
import flowExecutor from "./flow";

const IUBDSLParser = ({
  dsl,
  context,
}: ParserParamsOfIUBDSL) => {
  const {
    layoutContent, componentsCollection, actionsCollection,
    metadataMapping, relationshipsCollection, schemas,
    sysRtCxtInterface
  } = dsl;
  const parserContext = {
    context,
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
      return layoutParser({
        layoutNode: layoutContent,
      }, parserContext);
    case 'custom':
      return '';
    default:
      break;
  }
};

export default IUBDSLParser;

// 行为与表现分离
