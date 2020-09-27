/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo } from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { RenderComp } from './component-manage/component-store/render-component';
import { allComponentList } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';

export const DefaultCtx = React.createContext({});

const IUBDSLRuntimeContainer = React.memo<{dslParseRes: any}>(({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity,
    getSchemasInitValue,
    originSchemas,
    renderComponentKeys
  } = dslParseRes;

  const [state, setstate] = useState('嘻嘻哈哈');

  const ctx = {
    state
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setstate('呵呵嘻嘻');
  //     console.log('更新了全局数据');
  //   }, 2000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  // const { content = [], type: pageType } = layoutContent;

  const actualRenderComponentList = useMemo(() => {
    const renderCompFactory = RenderComp(allComponentList);
    return renderComponentKeys.map((id) => ({
      id,
      Comp: renderCompFactory(getCompParseInfo(id))
    }));
  }, [allComponentList]);

  return (
    <DefaultCtx.Provider value={ctx}>
      <FromWrapFactory>
        <LayoutRenderer
          layoutNode={actualRenderComponentList}
          componentRenderer={({ layoutNodeItem }) => {
            const { id: compId, Comp } = layoutNodeItem;

            /** 可以额外添加属性, 例如权限控制的属性传入 */
            return <Comp key={compId} extral={'扩展props'} unit={state} />;
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
});

export default IUBDSLRuntimeContainer;
