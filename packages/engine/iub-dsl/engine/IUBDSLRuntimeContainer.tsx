/* eslint-disable no-param-reassign */
import React, {
  useEffect, useMemo, useCallback, useContext, useRef, useState
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { cloneDeep } from 'lodash';
import { widgetRenderer, getCompRenderer } from './component-manage/component-store/render-component';
import { getWidget } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';
import { createIUBStore } from './state-manage';
import { eventParser } from './event-manage';
import { renderInfoListRenderer } from './component-manage/component-store/render-widget-struct';
import { RenderCompInfoItem } from './component-manage/component-store/types';
import { useCacheState } from './utils';

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

const genRuntimeCtxFn = (dslParseRes, runtimeCtx) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity, getActionFn,
    renderComponentKeys,
    schemasParseRes,
  } = dslParseRes;
  console.log('//___genRuntimeCtxFn___\\\\');
  const { IUBStoreEntity } = runtimeCtx;
  const {
    getPageState, updatePageState, targetUpdateState,
    IUBPageStore, useWatchState, pickKeyWord
  } = IUBStoreEntity;
  const useDynamicPropHandle = (dynamicProps: any = {}) => {
    const { value, onChange } = dynamicProps;

    /**
     * 1. 一个对象
     * 2. 特定条件下, 使用特定函数,改变对象某个部分
     * 3. const deep = [] // 在useMemo里面push是一个作死的做法
     */
    // 仅运行一次
    const onceDynmainProps = useMemo(() => {
      let result = {};
      if (onChange) {
        const { conf: { type: actionType, actionID }, handle } = onChange;
        if (actionType === 'actionRef') {
          result = {
            ...result,
            onChange: handle(getActionFn(actionID), { targetUpdateState })
          };
        }
      }
      return result;
    }, []);

    const list: any[] = [];
    // ? 每次都运行, 「应该可以换一种更好的方式」
    if (value) {
      const VV = getPageState(value);
      list.push({
        deps: [VV],
        handle: () => ({ value: VV })
      });
    }
    const propp = useUU(list);
    return useMemo(() => {
      return {
        ...onceDynmainProps,
        ...propp
      };
    }, [propp, onceDynmainProps]);
  };

  return {
    useDynamicPropHandle
  };
};

export const DefaultCtx = React.createContext<any>({});

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
    getPageState, updatePageState, IUBPageStore, useWatchState
  } = IUBStoreEntity;

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     updatePageState({
  //       a: 'b',
  //       entity_26: 'entity_263hj  '
  //     });
  //     setTimeout(() => {
  //       updatePageState({
  //         c: 'bdd',
  //       });
  //     }, 2000);
  //   }, 2000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  const genCompRendererInfo = useMemo(() => {
    return getCompRenderer(getWidget);
  }, [getWidget]);

  // TODO: 未加入布局结构, 仅是一层使用
  const actualRenderComponentList = renderComponentKeys.map((id) => {
    const { renderCompInfo, renderStructInfo } = getCompParseInfo(id);
    // 单独的组件渲染
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compRendererInfo = useMemo(() => {
      return Object.keys(renderCompInfo).reduce((res, mark) => {
        res[mark] = genCompRendererInfo(renderCompInfo[mark]);
        return res;
      }, {});
    }, [renderCompInfo]);
    // 单独的结构渲染
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      const Widget = widgetRenderer(
        renderInfoListRenderer(
          renderStructInfo, compRendererInfo
        )
      );
      return {
        id,
        Widget
      };
    }, [
      compRendererInfo, renderStructInfo
    ]);
  });

  const ctx = useMemo(() => genRuntimeCtxFn(dslParseRes, {
    IUBStoreEntity
  }), [IUBStoreEntity]);

  const extralProps = useMemo(() => ({ extral: '扩展props' }), []);

  return (
    <DefaultCtx.Provider value={ctx}>
      <pre>
        {JSON.stringify(getPageState(), null, 2)}
      </pre>
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
    </DefaultCtx.Provider>
  );
}, (prev, next) => {
  console.log(prev?.dslParseRes?.pageID === next?.dslParseRes?.pageID);

  return prev?.dslParseRes?.pageID === next?.dslParseRes?.pageID;
});

export default IUBDSLRuntimeContainer;
