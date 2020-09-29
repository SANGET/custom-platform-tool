/* eslint-disable no-param-reassign */
import React, {
  useState, useLayoutEffect, useEffect, useContext,
  useRef, useReducer,
  Dispatch, SetStateAction, useCallback
} from 'react';
import {
  get as LGet, set as LSet, defaultsDeep, cloneDeep
} from 'lodash';
import { CommonObjStruct } from '@iub-dsl/definition';
import { SchemasAnalysisRes } from './analysis/i-analysis';

type GetParam = string | {
  [str: string]: GetParam;
} | GetParam[]

/** useState增强 */
const useSetState: <S>(
  init: S | (() => S)
) => [S, Dispatch<SetStateAction<S>>] = (initialValueOrFn) => {
  const [state, set] = useState(initialValueOrFn);
  const setState = useCallback(
    (patch) => {
      const isPatchFunc = patch instanceof Function;
      set((prevState) => Object.assign({}, prevState, isPatchFunc ? patch(prevState) : patch));
    },
    [set],
  );
  return [state, setState];
};

// TODO
const getFullInitStruct = (baseStruct: CommonObjStruct) => {
  return Object.keys(baseStruct).reduce((result, key) => {
    if (typeof baseStruct[key] === 'string') {
      result[key] = baseStruct[key];
    } else if (Array.isArray(baseStruct[key])) {
      result[key] = [];
    } else {
      result[key] = getFullInitStruct(baseStruct[key]);
    }
    return result;
  }, {});
};

export const createIUBStore = (analysisData: SchemasAnalysisRes) => {
  const { levelRelation, pathMapInfo, baseStruct } = analysisData;

  const fullStruct = getFullInitStruct(baseStruct);

  return () => {
    const [IUBPageStore, setIUBPageStore] = useSetState(fullStruct);

    // useLayoutEffect(() => {
    // }, []);

    const getPageState = () => {
      return IUBPageStore;
    };

    const updatePageState = (newState: CommonObjStruct) => {
      setIUBPageStore(newState);
    };

    return {
      getPageState,
      updatePageState
    };
  };
};
