import { CommonObjStruct, TypeOfIUBDSL } from "@iub-dsl/core";
import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import LayoutParser from "./layout-parser";
import flowExecutor from "./flow";
import { RelationParser } from "./relation";
import { ActionsCollectionParser } from "./actions/actions-parser";
import ComponentCollectionParser from "./component/component-parser";
import SchemasParser from "./schemas/schemas-parser";

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
    sysRtCxtInterface,
    relationshipsCollection,
    layoutContent,
    id,
    name,
    type,
    schemas
  };

  parseContext = {
    ...parseContext,

  };

  return parseContext;
};

export default IUBDSLParser;
