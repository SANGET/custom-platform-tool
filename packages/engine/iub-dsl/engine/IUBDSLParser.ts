/** dont Overengineering */

import { TypeOfIUBDSL } from "@iub-dsl/definition";
import SchemasParser from "./state-manage/schemas";
import widgetParser from "./component-manage/widget-parser";
import { actionsCollectionParser } from "./actions-manage/actions-parser";
import { isPageState } from "./state-manage";
import { eventPropsHandle } from "./event-manage";

const extralUpdateStateConfParser = (actionConf, actionConfParseRes, parserContext) => {
  const { changeTarget } = actionConf;
  const { changeStateToUse, getStateToUse } = actionConfParseRes;
  if (changeTarget) {
    changeStateToUse.push(actionConf.changeTarget);
  }
  return actionConfParseRes;
};

const extralAPBDSLCURDOfConfParser = (actionConf, actionConfParseRes, parserContext) => {
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

  const actionConfParser = (actionConf, actionConfParseRes, parserContext) => {
    // isPageState
    console.log(actionConf);

    switch (actionConf.type) {
      case 'updateState':
        return extralUpdateStateConfParser(actionConf, actionConfParseRes, parserContext);
      case 'APBDSLCURD':
        return extralAPBDSLCURDOfConfParser(actionConf, actionConfParseRes, parserContext);
      default:
        return actionConfParseRes;
    }
  };
  return {
    propsParser,
    actionConfParser
  };
};

const IUBDSLParser = ({ dsl }) => {
  const {
    actionsCollection, sysRtCxtInterface,
    componentsCollection, schemas,
    metadataCollection, relationshipsCollection,
    layoutContent, pageID, name, type
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

  const parserContext = genIUBDSLParserCtx(parseRes);

  const renderComponentKeys = Object.keys(componentsCollection);

  /** 页面模型解析 */
  const schemasParseRes = SchemasParser(schemas);
  /** 每个动作解析成函数「流程将其连起来」 */
  const parseActionResult = actionsCollectionParser(actionsCollection, parserContext);
  console.log(parseActionResult);

  parseRes = {
    ...parseRes,
    schemasParseRes,
    getActionFn: (actionID: string) => {
      actionID = actionID.replace(/@\(actions\)\./, '');
      if (parseActionResult.actionIds.includes(actionID)) {
        return parseActionResult.actionParseRes[actionID];
      }
      return () => { console.error('未获取Actions'); };
    }
  };

  /** 组件解析 TODO: propsMap有问题, 上下文没有对其进行干预 */
  const componentParseRes = widgetParser(componentsCollection, {
    parserContext
  });

  parseRes = {
    ...parseRes,
    componentParseRes,
    renderComponentKeys,
    getCompParseInfo: (compId) => componentParseRes[compId]
  };

  console.log(parseRes);

  return parseRes;
};

export default IUBDSLParser;
