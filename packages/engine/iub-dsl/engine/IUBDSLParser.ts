/** dont Overengineering */

import { TypeOfIUBDSL } from "@iub-dsl/definition";
import SchemasParser from "./state-manage/schemas";
import widgetParser from "./component-manage/widget-parser";
import { actionsCollectionParser } from "./actions-manage/actions-parser";
import { flowParser } from './flow-engine';
import { isPageState } from "./state-manage";
import { eventPropsHandle } from "./event-manage";
import { datasourceMetaHandle } from "./datasource-meta";

const extralUpdateStateConfParser = (actionConf, actionConfParseRes, parseContext) => {
  const { changeTarget } = actionConf;
  const { changeStateToUse, getStateToUse } = actionConfParseRes;
  if (changeTarget) {
    changeStateToUse.push(actionConf.changeTarget);
  }
  return actionConfParseRes;
};

const extralAPBDSLCURDOfConfParser = (actionConf, actionConfParseRes, parseContext) => {
  const { changeStateToUse, getStateToUse } = actionConfParseRes;
  getStateToUse.push("@(schemas).entity_25", "@(schemas).entity_26", "@(schemas).entity_28");
  return actionConfParseRes;
};

const genIUBDSLParserCtx = (parseRes) => {
  /** param: 内部暴露功能或参数到外部 */
  const propsParser = (originHandle, ctx?) => {
    const { getStructItemInfo } = ctx;
    return (key, conf) => {
      let tempRes;
      if (isPageState(conf)) {
        return {
          type: 'dynamicProps',
          result: originHandle(key, conf),
          deps: [conf]
        };
      }

      if ((
        // 需要递归
        tempRes = eventPropsHandle(key, conf, {
          compTag: getStructItemInfo('compTag')
        })
      )) {
        return tempRes;
      }

      return originHandle(key, conf);
    };
  };

  const actionConfParser = (actionConf, actionConfParseRes, parseContext) => {
    // isPageState
    switch (actionConf.actionType) {
      case 'updateState':
        return extralUpdateStateConfParser(actionConf, actionConfParseRes, parseContext);
      case 'APBDSLCURD':
        return extralAPBDSLCURDOfConfParser(actionConf, actionConfParseRes, parseContext);
      default:
        return actionConfParseRes;
    }
  };
  return {
    propsParser,
    actionConfParser,
  };
};

const IUBDSLParser = ({ dsl }) => {
  const {
    actionsCollection, sysRtCxtInterface,
    componentsCollection, schemas,
    metadataCollection, relationshipsCollection,
    layoutContent, pageID, name, type,
    flowCollection
  } = dsl as TypeOfIUBDSL;

  let parseRes: any = {
    metadataCollection,
    sysRtCxtInterface,
    relationshipsCollection,
    layoutContent,
    pageID,
    name,
    type,
    schemas
  };

  /** TODO: 有问题 */
  const parseContext = genIUBDSLParserCtx(parseRes);

  const renderComponentKeys = Object.keys(componentsCollection);

  /** 数据源元数据解析和实体 */
  const datasourceMetaEntity = datasourceMetaHandle();

  /** 页面模型解析 */
  const schemasParseRes = SchemasParser(schemas);
  /** 每个动作解析成函数「流程将其连起来」 */
  const actionParseRes = actionsCollectionParser(actionsCollection, parseContext);

  parseRes = {
    ...parseRes,
    schemasParseRes,
    datasourceMetaEntity,
    actionParseRes
  };

  /** 组件解析 TODO: propsMap有问题, 上下文没有对其进行干预 */
  const componentParseRes = widgetParser(componentsCollection, {
    parseContext
  });

  const flowParseRes = flowParser(flowCollection, { parseContext, parseRes });
  // const { getFlowItemInfo } = flowParseRes;
  // const { flowItemRun } = getFlowItemInfo('flow1');
  // console.log(flowItemRun({
  //   getFlowItemInfo
  // })?.then());

  parseRes = {
    ...parseRes,
    ...flowParseRes,
    componentParseRes,
    renderComponentKeys,
    getCompParseInfo: (compId) => componentParseRes[compId]
  };

  console.log(parseRes);

  return parseRes;
};

export default IUBDSLParser;
