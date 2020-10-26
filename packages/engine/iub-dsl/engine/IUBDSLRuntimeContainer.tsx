/* eslint-disable no-param-reassign */
import React, {
  useEffect, useMemo, useCallback, useContext, useRef, useState
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';

import { pageManage } from '@consumer-app/web-platform/src/page-manage';

import { widgetRenderer, genCompRenderFC } from './component-manage/component-store/render-component';
import { getWidget } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';
import { createIUBStore } from './state-manage';
import { renderStructInfoListRenderer } from './component-manage/component-store/render-widget-struct';

import { DefaultCtx, genRuntimeCtxFn } from './runtime';
import { effectRelationship as genEffectRelationship } from './relationship';

const IUBDSLRuntimeContainer = ({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity,
    renderComponentKeys,
    schemasParseRes, pageID: pageId
  } = dslParseRes;

  /** 获取单例的页面管理 */
  const pageManageInstance = pageManage();

  const useIUBStore = useMemo(() => createIUBStore(schemasParseRes), [schemasParseRes]);
  const IUBStoreEntity = useIUBStore();
  const {
    getPageState, updatePageState, IUBPageStore
  } = IUBStoreEntity;

  const [runTimeLine, setRunTimeLine] = useState([]);

  const effectRelationship = useMemo(() => genEffectRelationship(), []);

  const runTimeCtxToBusiness = useRef<any>(() => ({ pageMark: '' }));
  /** 页面管理添加页面上下文 */
  useEffect(() => {
    const { pageMark, removeFn } = pageManageInstance.addPageCtx({
      pageId,
      pageType: 'IUBPage',
      context: runTimeCtxToBusiness
    });
    runTimeCtxToBusiness.current.pageMark = pageMark;
    /** 跨页面调用例子 */
    // if (pageMark === "pageID_$_1") {
    //   setInterval(() => {
    //     const ctxx = pageManageInstance.getIUBPageCtx('pageID_$_0')[0];
    //     console.log(ctxx.runtimeScheduler({}));
    //   }, 1000);
    // }

    // effectRelationship.effectReceiver([]);

    return () => {
      removeFn();
      const allPageCtx = pageManageInstance.getIUBPageCtx('');
      effectRelationship.effectDispatch(allPageCtx);
    };
  }, []);

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
    pageManageInstance,
    IUBStoreEntity,
    runTimeLine,
    setRunTimeLine,
    runTimeCtxToBusiness,
    effectRelationship,
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
};

export default IUBDSLRuntimeContainer;
