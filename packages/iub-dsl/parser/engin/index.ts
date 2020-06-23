import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import layoutParser from "./layout";

const IUBDSLParser = ({
  dsl,
  context,
  authUI
}: ParserParamsOfIUBDSL) => {
  const { layoutContent, componentsCollection, actionsCollection } = dsl;
  return layoutParser({
    layoutNode: layoutContent,
    authUI,
    bindAction: (actionID) => {
      // console.log(actionID);
      return actionsCollection[actionID];
    },
    bindComponent: (componentID) => {
      // console.log(componentID);
      return componentsCollection[componentID];
    }
  });
};

export default IUBDSLParser;

// 行为与表现分离
