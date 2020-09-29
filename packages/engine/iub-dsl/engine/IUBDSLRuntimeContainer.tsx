/* eslint-disable no-param-reassign */
import React, {
  useEffect, useMemo
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { RenderComp } from './component-manage/component-store/render-component';
import { getWidget } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';
import { createIUBStore } from './state-manage';

const getFullInitStruct = (baseStruct) => {
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

// useState<S>(initialState: ): [S, Dispatch<SetStateAction<S>>];
export const DefaultCtx = React.createContext({});

const IUBDSLRuntimeContainer = React.memo<{dslParseRes: any}>(({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity,
    renderComponentKeys,
    schemasParseRes,
  } = dslParseRes;
  console.log(schemasParseRes);

  // const [state, setstate] = useState('嘻嘻哈哈');
  const ctx = {
  };
  // const useIUBStore = useMemo(() => createIUBStore(schemasParseRes), [],);

  // const { getPageState, updatePageState } = useIUBStore();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     updatePageState({
  //       a: 'b',
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

  // const { content = [], type: pageType } = layoutContent;

  const actualRenderComponentList = useMemo(() => {
    const renderCompFactory = RenderComp(getWidget);
    return renderComponentKeys.map((id) => ({
      id,
      Comp: renderCompFactory(getCompParseInfo(id))
    }));
  }, [getWidget, dslParseRes]);

  return (
    <DefaultCtx.Provider value={ctx}>
      <FromWrapFactory>
        <LayoutRenderer
          layoutNode={actualRenderComponentList}
          componentRenderer={({ layoutNodeItem }) => {
            const { id: compId, Comp } = layoutNodeItem;

            /** 可以额外添加属性, 例如权限控制的属性传入 */
            return <Comp key={compId} extral={'扩展props'} />;
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
