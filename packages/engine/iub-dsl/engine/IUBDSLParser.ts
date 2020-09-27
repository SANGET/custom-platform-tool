/** dont Overengineering */

import { CommonObjStruct, TypeOfIUBDSL, AllComponentType } from "@iub-dsl/definition";
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
    layoutContent, pageID, name, type
  } = dsl as TypeOfIUBDSL;

  let parseContext: any = {
    metadataCollection,
    sysRtCxtInterface,
    relationshipsCollection,
    layoutContent,
    pageID,
    name,
    type,
    schemas
  };

  /** 页面模型解析 */
  const schemasParseRes = SchemasParser(schemas);
  /** 动作解析 */
  // const parseActionResult = ActionsCollectionParser(actionsCollection);

  parseContext = {
    ...parseContext,
    ...schemasParseRes,
    // bindAction: (actionID) => parseActionResult[actionID]
  };

  /** 数据转换兼容 */
  const { content } = layoutContent;
  const renderComponentKeys = Object.keys(componentsCollection);
  const tempCompConf: any = renderComponentKeys.reduce((res, key, i) => {
    res[key] = tempFnCompTransform(componentsCollection[key], i);
    return res;
  }, {});
  // let tempCompConf: any = Array.isArray(content) && content.map(tempFnCompTransform) || [];
  // tempCompConf = tempCompConf.reduce((res, val) => ({ ...res, [val.id]: val }), {});
  // const renderComponentKeys = Object.keys(tempCompConf);
  // layoutContent.content = Object.keys(tempCompConf).map()
  /** 数据转换兼容 */

  /** 组件解析 */
  const componentParseRes = componentParser(tempCompConf);
  console.log(componentParseRes);

  parseContext = {
    ...parseContext,
    componentParseRes,
    renderComponentKeys,
    getCompParseInfo: (compId) => componentParseRes[compId]
  };

  return parseContext;
};

export default IUBDSLParser;

/**
 * 临时转换函数
 */
const tempFnCompTransform = (compInfo, i) => {
  return {
    ...compInfo,
    compCode: compInfo.id,
    compId: compInfo.id,
    unit: '单位',
    placeholder: '请输入内容?',
    tipContent: `${compInfo.title}Tip:${i}`,
  };
};
