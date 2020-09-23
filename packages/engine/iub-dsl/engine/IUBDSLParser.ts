/** dont Overengineering */

import { CommonObjStruct, TypeOfIUBDSL } from "@iub-dsl/types";
import SchemasParser from "./state-manage/schemas";
import componentParser from "./component-manage/component-parser";
// import { componentParser } from "./component-manage/c";

// 全局的页面通信?
// state贯穿全局, 数据状态贯穿全局
// condition、when, 单步控制  // 全局?
// code、低代码引擎
// flow, 流程控制?

const IUBDSLParser = ({ dsl }) => {
  const {
    actionsCollection, sysRtCxtInterface,
    componentsCollection, schemas,
    metadataCollection, relationshipsCollection,
    layoutContent, id, name, type
  } = dsl as TypeOfIUBDSL;

  // 状态管理
  const d = Date.now();
  // console.log(dsl);
  let parseContext: any = {
    metadataCollection,
    sysRtCxtInterface,
    relationshipsCollection,
    layoutContent,
    id,
    name,
    type,
    schemas
  };

  const schemasParseRes = SchemasParser(schemas);
  // const parseActionResult = ActionsCollectionParser(actionsCollection);

  parseContext = {
    ...parseContext,
    ...schemasParseRes,
    // bindAction: (actionID) => parseActionResult[actionID]
  };

  const componentParseRes = componentParser();
  console.log(componentParseRes);

  parseContext = {
    ...parseContext,
    componentParseRes,
    getCompParseInfo: (compId) => componentParseRes[compId]
  };

  return parseContext;
};

export default IUBDSLParser;
