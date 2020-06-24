import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import layoutParser from "./layout";
import flowExecutor from "./flow";

const IUBDSLParser = ({
  dsl,
  context,
  authUI
}: ParserParamsOfIUBDSL) => {
  const {
    layoutContent, componentsCollection, actionsCollection,
    metadataMapping, relationshipsCollection, schemas,
    sysRtCxtInterface
  } = dsl;
  return layoutParser({
    context,
    layoutNode: layoutContent,
    authUI,
    bindAction: (actionID) => {
      // console.log(actionID);
      return actionsCollection[actionID];
    },
    bindComponent: (componentID) => {
      // console.log(componentID);
      return componentsCollection[componentID];
    },
  });
};

export default IUBDSLParser;

// 行为与表现分离
