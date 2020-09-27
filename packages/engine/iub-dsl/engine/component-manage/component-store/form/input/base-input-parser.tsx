import { baseInputRenderStructParser, genBaseInputFullRenderStruct } from "./base-input-render-struct";

/** 表单输入框组件所以配置的keys */
const getInputCompAllConfKeys = (conf) => Object.keys(conf);

/**
 * 解析组件入口, 需要merge其他选择
 * @param id 组件唯一ID
 * @param conf 组件配置
 * @param options 解析选项
 */
const baseInputCompParser = (id, conf, options) => {
  /** 解析阶段 */
  const allConfKey = getInputCompAllConfKeys(conf);
  const renderInfo = baseInputRenderStructParser(
    genBaseInputFullRenderStruct(),
    {
      baseMark: id,
      allConfKey,
      originConf: conf,
    }
  );

  /** 解析阶段 - end */
  return renderInfo;
};

export { baseInputCompParser };
