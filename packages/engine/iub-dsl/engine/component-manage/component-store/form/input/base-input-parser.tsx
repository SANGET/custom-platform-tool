import { baseInputRenderStructParser, genBaseInputFullRenderStruct } from "./base-input-render-struct";

const getInputCompAllConfKeys = (conf) => Object.keys(conf);
/**
  *
  * @param id
  * @param conf
  * @param options
  */
const baseInputCompParser = (id, conf, options) => {
  /** 解析阶段 */
  console.log(id, conf, options);
  const allConfKey = getInputCompAllConfKeys(conf);
  const renderInfo = baseInputRenderStructParser({
    baseMark: id,
    allConfKey,
    originConf: conf,
    struct: genBaseInputFullRenderStruct(),
    // TODO: 类型问题
    renderStruct: [],
    compPropsList: {}
  });
  const { renderStruct, compPropsList } = renderInfo;

  console.log(renderInfo);

  /** 解析阶段 - end */
  return {
    renderStruct,
    compPropsList,
    originConf: conf
  };
};

export { baseInputCompParser };
