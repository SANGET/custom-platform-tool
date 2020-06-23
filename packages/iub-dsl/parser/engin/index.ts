import componentParser from "./component-parser";
import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import layoutParser from "./layout";

// const parser = (pageDSL) => {
//   const res = pageDSL.body.map(({ component }) => {
//     return componentParser(component);
//   });
//   return res;
// };

// export default parser;

const IUBDSLParser = ({
  dsl,
  authUI
}: ParserParamsOfIUBDSL) => {
  const { layoutContent } = dsl;
  return layoutParser({
    type: 'Input'
  });
};

export default IUBDSLParser;

// 行为与表现分离
