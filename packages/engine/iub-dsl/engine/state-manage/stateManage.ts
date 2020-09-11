/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useContext } from 'react';
import {
  get as LGet, set as LSet, defaultsDeep, cloneDeep
} from '../component-manage/node_modules/lodash';

type GetParam = string | {
  [str: string]: GetParam;
} | GetParam[]

/**
 * 获取和结构转换
 *
 * 方案1
 * 1 . get, 之后的转换
 * 2. 结构转换时候的转换
 * 每次转换都要获取结构进行转换, 也不见得快多少
 *
 * 方案2
 * 1. 先获取后
 * 2. 再统一转换
 */

export const useIUBStore = (
  storeInit,
  enhancerConfig?,
) => {
  /** 实现标准 */
  const { baseStruct, allRuningHandle } = storeInit();

  console.log(baseStruct);
  const [state, set] = useState(baseStruct || {});

  useEffect(() => {
    allRuningHandle(({ prevPayload, pyload, newState }) => {
      console.log(newState);
      setState(newState);
    });
  }, []);

  /** 基础的结构解析 */
  function getState(getParam?: GetParam) { // 增强
    if (!getParam) return state;

    if (Array.isArray(getParam)) {
      return getParam.map((_) => (_ ? getState(_) : ''));
    }

    if (typeof getParam === 'string') {
      return LGet(state, getParam, 'err'); // 复杂类型获取
    }

    return Object.keys(getParam).reduce((result, key) => {
      result[key] = getParam[key] ? getState(getParam[key]) : '';
      return result;
    }, {});
  }

  // watch????? 为啥会这样? 是因为initStruct还是啥?
  function setState(sState) {
    Object.assign(state, sState);
    set(
      // defaultsDeep(sState, state)
      cloneDeep(state)
    );
  }
  return {
    setState,
    getState
  };
};
