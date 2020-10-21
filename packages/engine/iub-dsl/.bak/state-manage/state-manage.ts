/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
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
const getFullInitStruct = ({ baseStruct, pathMapInfo }: {
  baseStruct: CommonObjStruct,
  pathMapInfo: any
}) => {
  return Object.keys(baseStruct).reduce((result, key) => {
    if (typeof baseStruct[key] === 'string') {
      // result[key] = key;
      result[key] = baseStruct[key];
    } else if (
      pathMapInfo[key]?.structType === 'structArray'
      // Array.isArray(baseStruct[key])
    ) {
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
export const pickKeyWord = (text:string) => text.replace(SchemasRegExp, '') || text;

/** TODO: 跨页面问题 */
export const createIUBStore = (analysisData: SchemasAnalysisRes) => {
  const { levelRelation, pathMapInfo, baseStruct } = analysisData;

  const fullStruct = getFullInitStruct({ baseStruct, pathMapInfo });
  return () => {
    const [IUBPageStore, setIUBPageStore] = useCacheState(fullStruct);

    /** 放到里面会锁定, 放到外面会一直被重新定义 */
    const getPageState = (strOrStruct?) => {
      if (typeof strOrStruct === 'string') {
        if (isPageState(strOrStruct)) {
          return LGet(IUBPageStore, pickKeyWord(strOrStruct), '');
        }
        // console.warn('stateManage: 非schemas描述');
        // TODO
        return strOrStruct;
      }
      if (Array.isArray(strOrStruct)) {
        return strOrStruct.map((newStruct) => getPageState(newStruct));
      }
      if (typeof strOrStruct === 'object') {
        const structKeys = Object.keys(strOrStruct);
        return structKeys.reduce((result, key) => {
          result[key] = getPageState(strOrStruct[key]);
          return result;
        }, {});
      }
      return IUBPageStore;
    };
    const getWatchDeps = getPageState;

    const handleFn = useMemo(() => {
      const targetUpdateState = (target, value) => {
        target = pickKeyWord(target);
        setIUBPageStore({
          [target]: value
        });
      };

      const updatePageState = (newState: CommonObjStruct) => {
        setIUBPageStore(newState);
      };

      return {
        updatePageState,
        isPageState,
        targetUpdateState,
        pickKeyWord,
      };
    }, []);

    return {
      getPageState,
      getWatchDeps,
      ...handleFn,
      IUBPageStore
    };
  };
};
