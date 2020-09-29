/** dont Overengineering */

import {
  CommonObjStruct, TypeOfIUBDSL, AllComponentType, FoundationType
} from "@iub-dsl/definition";
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

  console.log(schemas);

  /** TODO: 临时代码 - 数据转换兼容 */
  const { content } = layoutContent;
  const renderComponentKeys = Object.keys(componentsCollection);
  const tempCompConf: any = renderComponentKeys.reduce((res, key, i) => {
    if (componentsCollection[key].compType === AllComponentType.FormInput) {
      componentsCollection[key] = {
        ...componentsCollection[key],
        // ...addConf(key, i)
      };
      schemas[`${key}${i}`] = {
        fieldMapping: "tableId1.fieldId1",
        type: FoundationType.string
      };
    }
    res[key] = tempFnCompTransform(componentsCollection[key], i);
    return res;
  }, {});
  // let tempCompConf: any = Array.isArray(content) && content.map(tempFnCompTransform) || [];
  // tempCompConf = tempCompConf.reduce((res, val) => ({ ...res, [val.id]: val }), {});
  // const renderComponentKeys = Object.keys(tempCompConf);
  // layoutContent.content = Object.keys(tempCompConf).map()
  /** TODO: 临时代码 - 数据转换兼容 */

  /** 页面模型解析 */
  const schemasParseRes = SchemasParser(schemas);
  /** 动作解析 */
  // const parseActionResult = ActionsCollectionParser(actionsCollection);

  parseContext = {
    ...parseContext,
    schemasParseRes,
    // bindAction: (actionID) => parseActionResult[actionID]
  };

  console.log(tempCompConf);

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
    label: compInfo.title,
    compCode: compInfo.id,
    compId: compInfo.id,
    // unit: '单位',
    // placeholder: '请输入内容?',
    // value: '文本框内容',
    // tipContent: `${compInfo.title}Tip:${i}`,
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
