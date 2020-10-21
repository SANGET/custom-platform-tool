/* eslint-disable no-param-reassign */
import React, {
  useEffect, useMemo, useCallback, useContext, useRef, useState
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { widgetRenderer, genCompRenderFC } from './component-manage/component-store/render-component';
import { getWidget } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';
import { createIUBStore } from './state-manage';
import { renderStructInfoListRenderer } from './component-manage/component-store/render-widget-struct';

import { DefaultCtx, genRuntimeCtxFn } from './runtime';

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
  const runTimeCtxToBusiness = useRef(() => {});

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
    runTimeLine,
    setRunTimeLine,
    runTimeCtxToBusiness
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
