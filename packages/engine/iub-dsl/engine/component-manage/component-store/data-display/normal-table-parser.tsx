import { normalTableRenderStructParser, genNormalTableFullRenderStruct } from "./normal-table-render-struct";

import { AllUI } from "../../UI-factory/types";

/** 表单输入框组件所以配置的keys */
const getTableCompAllConfKeys = (conf) => Object.keys(conf);

/**
 * 解析组件入口, 需要merge其他选择
 * @param id 组件唯一ID
 * @param conf 组件配置
 * @param options 解析选项
 */
const normalTableParser = (id, conf, options): any => {
  /** 解析阶段 */
  const allConfKey = getTableCompAllConfKeys(conf);
  const renderInfo = normalTableRenderStructParser(
    genNormalTableFullRenderStruct(),
    {
      baseMark: id,
      allConfKey,
      originConf: conf,
    }
  );

  /** 解析阶段 - end */
  return renderInfo;
};

export { normalTableParser };
