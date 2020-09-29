import React, {
  useContext, useState, useMemo, useEffect
} from 'react';
import { AllComponentType } from "@iub-dsl/definition";
import componentConf from './mock';
import { AllUI } from './UI-factory/types';
import { ActualRenderInfo } from './component-store/types/renderStruct';

// TODO:: 引入问题
import { baseInputCompParser } from './component-parser/base-input-parser';
import { normalTableParser } from './component-parser/normal-table-parser';

/**
 * 调度对应的组件解析器进行解析
 * @param id IUB_DSL组件ID
 * @param confItem IUB-DSL组件配置
 * @param options 选项
 */
const compParseScheduler = (id, confItem, options): ActualRenderInfo[] => {
  const { compType } = confItem;
  switch (compType) {
    case AllComponentType.FormInput:
      return baseInputCompParser(id, confItem, options);
    case AllComponentType.NormalTable:
      return normalTableParser(id, confItem, options);
    default:
      return [{
        compTag: AllUI.Error,
        mark: id,
        propsKeys: [],
        propsMap: [],
        renderStruct: [],
      }];
  }
};

const componentParser = (conf = componentConf, options?) => {
  const allCompId = Object.keys(conf);

  const compParseRes: any = {};
  let confItem;
  allCompId.forEach((id) => {
    confItem = conf[id];
    compParseRes[id] = compParseScheduler(id, confItem, options);
  });
  return compParseRes;
};

export default componentParser;
