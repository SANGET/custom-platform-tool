/** dont Overengineering */

import {
  CommonObjStruct, TypeOfIUBDSL, AllComponentType, FoundationType
} from "@iub-dsl/definition";
import SchemasParser from "./state-manage/schemas";
import widgetParser from "./component-manage/widget-parser";
import { actionsCollectionParser } from "./actions-manage/actions-parser";
import { isPageState } from "./state-manage";
import { eventParser, eventPropsHandle } from "./event-manage";

// 全局的页面通信?
// state贯穿全局, 数据状态贯穿全局
// condition、when, 单步控制  // 全局?
// code、低代码引擎
// flow, 流程控制?

const genIUBDSLParserCtx = (parseRes) => {
  const propsParser = (originHandle, ctx?) => {
    const { getStructItemInfo } = ctx;
    return (key, conf) => {
      let tempRes;
      if (isPageState(conf)) {
        return {
          type: 'dynamicProps',
          result: originHandle(key, conf)
        };
      }

      if ((
        tempRes = eventPropsHandle(key, conf, {
          compTag: getStructItemInfo('compTag')
        })
      )) {
        return {
          type: 'widgetEvent',
          result: tempRes
        };
      }

      return originHandle(key, conf);
    };
  };
  return {
    propsParser
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

  /** TODO: 临时代码 - 数据转换兼容 */
  const renderComponentKeys = Object.keys(componentsCollection);
  // const tempCompConf: any = renderComponentKeys.reduce((res, key, i) => {
  //   if (componentsCollection[key].compType === AllComponentType.FormInput) {
  //     componentsCollection[key] = {
  //       ...componentsCollection[key],
  //       ...addConf(key, i)
  //     };
  //     schemas[`${key}${i}`] = {
  //       fieldMapping: "tableId1.fieldId1",
  //       type: FoundationType.string
  //     };
  //   }
  //   res[key] = tempFnCompTransform(componentsCollection[key], i);
  //   return res;
  // }, {});
  // let tempCompConf: any = Array.isArray(content) && content.map(tempFnCompTransform) || [];
  // tempCompConf = tempCompConf.reduce((res, val) => ({ ...res, [val.id]: val }), {});
  // const renderComponentKeys = Object.keys(tempCompConf);
  // layoutContent.content = Object.keys(tempCompConf).map()
  /** TODO: 临时代码 - 数据转换兼容 */

  /** 页面模型解析 */
  const schemasParseRes = SchemasParser(schemas);
  /** 每个动作解析成函数「流程将其连起来」 */
  const parseActionResult = actionsCollectionParser(actionsCollection);

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

/**
 * 临时转换函数
 */
const tempFnCompTransform = (compInfo, i) => {
  return {
    ...compInfo,
    label: compInfo.title,
    compCode: compInfo.id,
    compId: compInfo.id,
    unit: '单位',
    placeholder: '请输入内容?',
    // value: '文本框内容',
    tipContent: `${compInfo.title}Tip:${i}`,
  };
};

const addConf = (key, index): any => ({
  value: `@(schemas).${key}${index}`,
  actions: {
    onChange: {
      type: 'actionRef',
      actionID: `@(actions).${key}${index}`
    }
  }
});
