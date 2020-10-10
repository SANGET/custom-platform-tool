/* eslint-disable no-param-reassign */
import React, {
  useState, useLayoutEffect, useEffect, useContext,
  useRef, useReducer, useMemo,
  Dispatch, SetStateAction, useCallback
} from 'react';
import {
  get as LGet, set as LSet, defaultsDeep, cloneDeep
} from 'lodash';
import { CommonObjStruct } from '@iub-dsl/definition';
import { SchemasAnalysisRes } from './analysis/i-analysis';
import { useCacheState } from '../utils';

type GetParam = string | {
  [str: string]: GetParam;
} | GetParam[]

// TODO
const getFullInitStruct = (baseStruct: CommonObjStruct) => {
  return Object.keys(baseStruct).reduce((result, key) => {
    if (typeof baseStruct[key] === 'string') {
      result[key] = key;
      // result[key] = baseStruct[key];
    } else if (Array.isArray(baseStruct[key])) {
      result[key] = [];
    } else {
      result[key] = getFullInitStruct(baseStruct[key]);
    }
    return result;
  }, {});
};

const SchemasRegExp = /^@\(schemas\)\./;
/** 状态管理的AOP/util */
export const isPageState = (text: string) => SchemasRegExp.test(text);
export const pickKeyWord = (text:string) => text.replace(SchemasRegExp, '');

/** TODO: 跨页面问题 */
export const createIUBStore = (analysisData: SchemasAnalysisRes) => {
  const { levelRelation, pathMapInfo, baseStruct } = analysisData;

  const fullStruct = getFullInitStruct(baseStruct);
  return () => {
    const [IUBPageStore, setIUBPageStore] = useCacheState(fullStruct);

    /** 放到里面会锁定, 放到外面会一直被重新定义 */
    const getPageState = (strOrStruct?) => {
      if (typeof strOrStruct === 'string') {
        if (isPageState(strOrStruct)) {
          return LGet(IUBPageStore, pickKeyWord(strOrStruct), '');
        }
        return '';
      }
      return IUBPageStore;
    };
    const handleFn = useMemo(() => {
      const targetUpdateState = (target, value) => {
        target = pickKeyWord(target);
        setIUBPageStore({
          [target]: value
        });
      };

      // const useWatchState = useMemo(() => {
      //   debugger;
      //   return (target, handle) => {
      //     target = pickKeyWord(target);
      //     handle(getPageState(target));
      //   };
      // }, [IUBPageStore]);
      // const [watchArr, setWatchArr] = useState<any[]>([]);
      // const watch = useMemo(() => {
      //   return watchArr.map(({ target }) => IUBPageStore[target]);
      // }, [watchArr]);
      // useEffect(() => {
      //   console.log(watch);
      //   console.log(JSON.stringify(watchArr));
      // }, [...watch]);

      const useWatchState = (target, handle) => {
        target = pickKeyWord(target);
        // setWatchArr((preArr) => {
        //   return [...preArr, { target, handle }];
        // });
        useEffect(() => {
          handle(getPageState(target));
        }, [IUBPageStore[target]]);
      };

      const updatePageState = (newState: CommonObjStruct) => {
        setIUBPageStore(newState);
      };

      return {
        updatePageState,
        isPageState,
        targetUpdateState,
        pickKeyWord,
        useWatchState,
      };
    }, []);

    return {
      getPageState,
      ...handleFn,
      IUBPageStore
    };
  };
};
