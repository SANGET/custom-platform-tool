import { normalTableRenderStructParser, genNormalButtonFullRenderStruct } from "./normal-button-render-struct";

/** 表单输入框组件所以配置的keys */
const getTableCompAllConfKeys = (conf) => Object.keys(conf);

/**
 * 解析组件入口, 需要merge其他选择
 * @param id 组件唯一ID
 * @param conf 组件配置
 * @param widgetParserOptions 解析选项
 */
const normalButtonParser = (id, conf, widgetParserOptions): any => {
  /** 解析阶段 */
  const allConfKey = getTableCompAllConfKeys(conf);
  const renderInfo = normalTableRenderStructParser(
    genNormalButtonFullRenderStruct(),
    {
      baseMark: id,
      allConfKey,
      originConf: conf,
    },
    widgetParserOptions
  );

  /** 解析阶段 - end */
  return renderInfo;
};

export { normalButtonParser };
