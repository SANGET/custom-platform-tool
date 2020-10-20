/* eslint-disable no-param-reassign */
import React, {
  useEffect, useMemo, useCallback, useContext, useRef, useState
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { widgetRenderer, genCompRenderFC } from './component-manage/component-store/render-component';
import { getWidget } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';
import { createIUBStore } from './state-manage';
import { genEventWrapFnList, useEventProps } from './event-manage';
import { renderStructInfoListRenderer } from './component-manage/component-store/render-widget-struct';
import { useCacheState } from './utils';
import { APBDSLrequest as originReq } from './utils/apb-dsl';
import { conditionEngine } from './condition-engine/condition-engine';
import { APBDSLCondControlResHandle, getAPBDSLCondOperatorHandle } from './actions-manage/business-actions/APBDSL';

const useUU = (setListConf: any[] = []) => {
  const [prop, setProp] = useCacheState({});
  setListConf.forEach(({ deps = [], handle }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setProp(handle(prop));
    }, deps);
  });
  return prop;
};
const APBDSLrequest = async (reqParam) => {
  const APBDSLRes = await originReq(reqParam);
  const action = {
    action: {
      type: 'APBDSLRes',
      payload: APBDSLRes
    }
  };
  return action;
};

const genRuntimeCtxFn = (dslParseRes, runtimeCtx) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity, getActionFn,
    renderComponentKeys,
    schemasParseRes,
    getFlowItemInfo,
  } = dslParseRes;
  console.log('//___genRuntimeCtxFn___\\\\');
  const {
    IUBStoreEntity,
    runTimeLine,
    setRunTimeLine,
    runTimeCtxToUse
  } = runtimeCtx;
  const {
    getPageState,
    getWatchDeps,
    updatePageState, targetUpdateState,
    IUBPageStore, pickKeyWord, isPageState
  } = IUBStoreEntity;

  const runtimeContext = {
    targetUpdateState,
    updatePageState,
    getPageState,
    getWatchDeps,
    APBDSLrequest
  };
  const runtimeFnScheduler = async ({
    action, type, params, actionName
  }) => {
    // if (Object.prototype.toString.call(action) === "[object Object]") {
    //   setRunTimeLine([...runTimeLine, action]);
    // }

    if (type === 'ConditionHandleOfAPBDSL') {
      const expsValueHandle = (expsValue) => {
        console.log(expsValue);
        expsValue[1] = '';
        // return expsValue;
        return false;
      };
      return await conditionEngine(params[0], {
        expsValueHandle,
        condControlResHandle: APBDSLCondControlResHandle,
        getOperatorHandle: getAPBDSLCondOperatorHandle,
      });
    }

    const runRes = await runtimeContext[type](...params);

    return runRes;
  };

  /** 在事件运行中使用的上下文 */
  runTimeCtxToUse.current = {
    runtimeFnScheduler
  };

  /**
   * !! 注意: 引用关系的处理「一大难题」
   * ?? 错误的想法/做法:
   * 1. 在useXX中, 不要做一些有副作用的事情. 如修改deps
   * 2. 既然是动态的props, 仅运行一次, 是有问题的.
   *  「有什么好的办法进行针对的合理的运行, 使其需要运行时正确获取/修改数据」
   *  「最根本问题: props, 没有根据state正常更新「学习参考redux」」
   * 3.
   */
  const useDynamicPropHandle = (dynamicProps: any = {}) => {
    const { value, dataSource } = dynamicProps;

    const list: any[] = [];
    if (value) {
      const newState = getPageState(value);
      list.push({
        deps: [newState],
        handle: () => ({ value: newState })
      });
    }
    if (dataSource) {
      const newDataSource = getPageState(dataSource);
      list.push({
        deps: [newDataSource],
        handle: () => ({
          dataSource: newDataSource
        })
      });
    }
    const propp = useUU(list);

    return useMemo(() => {
      return {
        ...propp
      };
    }, [
      propp,
    ]);
  };

  const useRunTimeFn = (dynamicProps = {}) => {
    /** 载入上下文,生成实际的fn */
    // watch 事件 用到的state
    const eventWrapFnList = useMemo(() => genEventWrapFnList(dynamicProps, { getFlowItemInfo }), []);

    const eventProps = useEventProps(eventWrapFnList, runTimeCtxToUse);
    // const eventProps = {};
    return eventProps;
  };

  // 先放着
  const conditionParamHandle = (originHandle, ctx) => {
    return (param) => {
      const { expsValue } = param;
      param.expsValue = expsValue.map((val) => getPageState(val));
      return originHandle(param);
    };
  };

  return {
    useDynamicPropHandle,
    conditionParamHandle,
    useRunTimeFn,
    runTimeCtxToUse
  };
};

export const DefaultCtx = React.createContext<any>({});
export const RunTimeCtx = React.createContext<any>({});

const IUBDSLRuntimeContainer = React.memo<{dslParseRes: any}>(({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity,
    renderComponentKeys,
    schemasParseRes,
  } = dslParseRes;
  const useIUBStore = useMemo(() => createIUBStore(schemasParseRes), [schemasParseRes]);
  const IUBStoreEntity = useIUBStore();
  const {
    getPageState, updatePageState, IUBPageStore
  } = IUBStoreEntity;
  const [runTimeLine, setRunTimeLine] = useState([]);
  const runTimeCtxToUse = useRef(() => {});

  // useTempCode(IUBStoreEntity);

  const genCompRenderFCToUse = useMemo(() => {
    return genCompRenderFC(getWidget);
  }, [getWidget]);

  // TODO: 未加入布局结构, 仅是一层使用
  const actualRenderComponentList = renderComponentKeys.map((id) => {
    const { renderCompInfo, renderStructInfo } = getCompParseInfo(id);
    // 单独的组件渲染
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compRendererFCList = useMemo(() => {
      return Object.keys(renderCompInfo).reduce((res, mark) => {
        res[mark] = genCompRenderFCToUse(renderCompInfo[mark]);
        return res;
      }, {});
    }, [renderCompInfo]);
    // 单独的结构渲染
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      const Widget = widgetRenderer(
        renderStructInfoListRenderer(
          renderStructInfo, compRendererFCList
        )
      );
      return {
        id,
        Widget
      };
    }, [
      compRendererFCList, renderStructInfo
    ]);
  });

  const ctx = useMemo(() => genRuntimeCtxFn(dslParseRes, {
    IUBStoreEntity,
    APBDSLrequest,
    runTimeLine,
    setRunTimeLine,
    runTimeCtxToUse
  }), [IUBStoreEntity]);

  const extralProps = useMemo(() => ({ extral: '扩展props' }), []);

  return (
    <DefaultCtx.Provider value={ctx}>
      <FromWrapFactory>
        <LayoutRenderer
          layoutNode={actualRenderComponentList}
          componentRenderer={({ layoutNodeItem }) => {
            const { id: compId, Widget } = layoutNodeItem;

            return <Widget key={compId} {...extralProps}/>;
          }}
          RootRender={(child) => {
            return (<div>
              {child}
            </div>);
          }}
        />
      </FromWrapFactory>
      <pre>
        {JSON.stringify(getPageState(), null, 2)}
      </pre>
    </DefaultCtx.Provider>
  );
}, (prev, next) => {
  // console.log(prev?.dslParseRes?.pageID === next?.dslParseRes?.pageID);

  return prev?.dslParseRes?.pageID === next?.dslParseRes?.pageID;
});

export default IUBDSLRuntimeContainer;
