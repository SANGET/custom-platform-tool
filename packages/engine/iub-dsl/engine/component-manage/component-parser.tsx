import React, {
  useContext, useState, useMemo, useEffect
} from 'react';
import { AllComponentType } from "@iub-dsl/definition";
import { cloneDeep } from 'lodash';
import componentConf from './mock';
import { baseInputCompParser } from './component-parser/base-input-parser';

/**
 * 调度对应的组件解析器进行解析
 * @param id IUB_DSL组件ID
 * @param confItem IUB-DSL组件配置
 * @param options 选项
 */
const compParseScheduler = (id, confItem, options) => {
  const { compType } = confItem;
  switch (compType) {
    case AllComponentType.Input:
      return baseInputCompParser(id, confItem, options);
    default:
      return () => {};
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
