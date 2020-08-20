import { CommonObjStruct } from "@iub-dsl/core";
import { ParserParamsOfIUBDSL } from "../types/parser-interface";
import LayoutParser from "./layout-parser";
import flowExecutor from "./flow";
import { RelationParser } from "./relation";
import { ActionsCollectionParser } from "./actions/actions-parser";
import ComponentCollectionParser from "./component/component-parser";
import DataSchemasParser, { InitPageState } from "./schemas/schemas-parser";

// 绑定数据、观察变化、局部优化
// TODO: 每次都是重新解析渲染
/**
 * 预编译
 * 实际使用
 * dataChange
 * vaild --> fn/view
 * 由规则进行绑定事件~~~
 * 流程控制
 * context?
 * 数据变更关系的解析、数据收集
 * 弹窗、页面通信
 * 校验: TODO
 *
 * Relation: 解决副作用、拦截、通用、动态插拔的关系??
 */
const IUBDSLParser = ({
  dsl, context // 需要的上下文依赖
}: ParserParamsOfIUBDSL) => {
  const {
    layoutContent, componentsCollection, actionsCollection,
    metadataCollection, relationshipsCollection, schemas,
    sysRtCxtInterface
  } = dsl;
  const d = Date.now();
  let parseRelationRes: CommonObjStruct = {};
  let parseContext = {};
  // 数据模型解析
  const {
    // pageRuntimeState, setPageRuntimeState
    schemaStruct, mappingEntity
  } = DataSchemasParser({ metadataCollection, schemas });

  // TODO: 建立引用关系,动态获取其他页面引用的数据 ??
  const { pageRuntimeState, setPageRuntimeState } = InitPageState(schemaStruct);
  parseContext = {
    mappingEntity,
    pageRuntimeState,
    setPageRuntimeState,
  };
  // action的依赖??
  parseRelationRes = RelationParser('DataSchemasParseEnd', relationshipsCollection, parseContext);
  console.log(parseRelationRes);

  const parseActionResult = ActionsCollectionParser(actionsCollection);

  parseContext = {
    ...parseContext,
    ...parseRelationRes,
    bindAction: (actionID) => parseActionResult[actionID]
  };

  // 验证依赖和时机是否满足、满足则执行
  // parseRelation('', relationshipsCollection, parseContext);

  const componentParseRes = ComponentCollectionParser(componentsCollection, parseContext);

  parseContext = {
    ...parseContext,
    bindComponent: (compId) => componentParseRes[compId]
  };

  const layoutParseRes = LayoutParser({ layoutNode: layoutContent.content }, parseContext);

  parseContext = {
    ...parseContext,
    layoutParseRes
  };

  console.log(Date.now() - d);

  console.log(parseContext);

  return parseContext;
};

/**
 * 分开渲染有必要但不是现在重要的
 */
const IUBDSLRender = () => {

};

export default IUBDSLParser;
