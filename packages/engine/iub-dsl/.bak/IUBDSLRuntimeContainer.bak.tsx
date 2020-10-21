/* eslint-disable no-param-reassign */
import React, {
  useEffect, useMemo, useCallback, useContext
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { cloneDeep } from 'lodash';
import { RenderComp } from './component-manage/component-store/render-component';
import { getWidget } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';
import { createIUBStore } from './state-manage';
import { eventParser } from './event-manage';
import { ActualRenderInfo } from './component-manage/component-store/types';

// 解析、预备、运行 // 作用提供环境
const auseRuntimeCtx = (dslParseRes, runtimeCtx) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity, getActionFn,
    renderComponentKeys,
    schemasParseRes,
  } = dslParseRes;
  const { IUBStoreEntity } = runtimeCtx;
  console.log(dslParseRes);

  console.log('reCtx');

  // 状态管理
  // const IUBStoreEntity = useMemo(() => createIUBStore(schemasParseRes)(), [schemasParseRes]);
  // const IUBStoreEntity = createIUBStore(schemasParseRes);
  const {
    getPageState, isPageState, targetUpdateState, useWatchState, IUBPageStore,
    pickPageStateKeyWord
  } = IUBStoreEntity;

  // 条件处理
  // 关系处理
  // 低代码

  // 元数据处理
  // 事件、动作、流程
  // 原本的处理 originHandle

  const runtimePropHandle = (originHandle, param, context) => {
    // console.log(111, param);

    const {
      key, val, type, target
    } = param;
    // 获取状态
    if (val && isPageState(val)) {
      param.val = getPageState(val);
      return originHandle(param, context);
    }

    // TODO: 待修改 onChange
    if (key && key === 'actions') {
      const { eventParseRes, event } = eventParser(val);
      const newParam = eventParseRes.map(({ handle, conf }, i) => {
        return {
          key: event[i],
          val: handle(getActionFn(conf.actionID), { targetUpdateState })
        };
      });
      return originHandle(newParam, context);
    }

    // testFailed
    if (type === 'watch' && target) {
      // eslint-disable-next-line react-hooks/rules-of-hooks

      // useWatchState(target, () => {
      // });
      return false;
    }
    return false;
  };
  return runtimePropHandle;
};

// useState<S>(initialState: ): [S, Dispatch<SetStateAction<S>>];
export const DefaultCtx = React.createContext<any>({});

const rendererComp = (info: ActualRenderInfo) => {
  const {
    compTag, mark, propsKeys, propsMap
  } = info;
  const Comp = getWidget(compTag);

  const dynamicProps = {};

  const staticAttr = propsMap.reduce((res, { key, val }) => {
    if (key !== 'value') {
      res[key] = val;
    } else {
      dynamicProps[key] = val;
    }
    return res;
  }, {});

  return ({ children, extralProps: actralExtralProps }) => {
    const { useDynamicPropHandle } = useContext(DefaultCtx);
    const actralProps = useDynamicPropHandle?.(dynamicProps);
    // ! 全局透传的extralProps一改全改:: 谨慎
    // const actralExtralProps = useMemo(() => {
    //   return extralProps;
    // }, [extralProps]);
    const actralComp = useMemo(() => {
      console.log(12332);
      return (
        <Comp
          {...staticAttr}
          {...actralExtralProps}
          {...actralProps}
          children={children}
          // {...dynamicProps}
        />
      );
    }, [staticAttr, actralExtralProps, actralProps]);

    return actralComp;
  };
};

const ctxFn = (dslParseRes, runtimeCtx) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity, getActionFn,
    renderComponentKeys,
    schemasParseRes,
  } = dslParseRes;
  console.log(1233);
  const { IUBStoreEntity } = runtimeCtx;
  const {
    getPageState, updatePageState, IUBPageStore, useWatchState, pickPageStateKeyWord
  } = IUBStoreEntity;
  const useDynamicPropHandle = (dynamicProps) => {
    if (dynamicProps.value) {
      const target = pickPageStateKeyWord(dynamicProps.value);
      return useMemo(() => {
        const newProps = cloneDeep(dynamicProps);
        newProps.value = getPageState(newProps.value);
        return newProps;
      }, [getPageState(dynamicProps.value)]);
    }
    return dynamicProps;
  };

  return {
    useDynamicPropHandle
  };
};

const IUBDSLRuntimeContainer = React.memo<{dslParseRes: any}>(({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity,
    renderComponentKeys,
    schemasParseRes,
  } = dslParseRes;
  // console.log(schemasParseRes);

  // const [state, setstate] = useState('嘻嘻哈哈');
  const useIUBStore = useMemo(() => createIUBStore(schemasParseRes), [schemasParseRes]);
  const IUBStoreEntity = useIUBStore();
  const {
    getPageState, updatePageState, IUBPageStore, useWatchState
  } = IUBStoreEntity;
  // TODO: 嵌套就出问题
  // useEffect(() => {
  //   console.log(11);
  // }, [IUBPageStore]);
  // TODO: 不嵌套就可以
  // useWatchState('entity_25', () => {
  //   console.log(123);
  // });

  const runtimeHandle = useMemo(() => auseRuntimeCtx(dslParseRes, {
    IUBStoreEntity
  }), []);

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
  const newCompInfo = useMemo(() => {
    return Object.keys(componentParseRes).reduce((res, key) => {
      const temp = componentParseRes[key].renderI;
      if (temp) {
        res[key] = Object.keys(temp).reduce((r, k) => {
          r[k] = rendererComp(temp[k]);
          return r;
        }, {});
      }
      return res;
    }, {});
  }, []);
  const renderInfoList = (
    actualRenderInfo: any[],
    compList
  ) => {
    const renderer: any[] = [];
    const structLength = actualRenderInfo.length;
    for (let i = 0; i < structLength; i++) {
      renderer.push(renderInfo(actualRenderInfo[i], compList));
    }
    return renderer;
  };
  const renderInfo = (
    info,
    compList
  ) => {
    const { mark, renderStruct } = info;
    const Comp = compList[mark];

    const childrens = renderStruct?.length
      ? renderInfoList(renderStruct, compList) : undefined;

    return ({ extralProps }) => {
      // ! 全局透传的extralProps一改全改:: 谨慎
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const actralExtralProps = useMemo(() => {
        return extralProps;
      }, [extralProps]);
      const actualChild = childrens?.map((Ch, i) => <Ch extralProps={actralExtralProps} key={mark + i}/>);
      return (<Comp extralProps={actralExtralProps} key={mark} children={actualChild} />);
    };
  };

  const RenderList = () => {
    // const renderCompList = renderComponentKeys.map((id) => newCompInfo[id]).filter((i) => i);
    // console.log(renderCompList);
    let temp;
    const CC = renderComponentKeys.map((id) => {
      if ((temp = newCompInfo[id])) {
        const Comps = renderInfoList(getCompParseInfo(id), temp);
        return Comps;
      }
      return false;
    }).filter((i) => i);
    console.log(CC);
    return CC;
  };
  const newComps = useMemo(() => RenderList(), []);
  console.log(newComps);

  console.log(newCompInfo);

  const actualRenderComponentList = useMemo(() => {
    const renderCompFactory = RenderComp(getWidget, { runtimeHandle });
    return renderComponentKeys.map((id) => ({
      id,
      Comp: renderCompFactory(getCompParseInfo(id))
    }));
  }, [getWidget, dslParseRes]);

  const ctx = useMemo(() => ctxFn(dslParseRes, {
    IUBStoreEntity
  }), [IUBStoreEntity]);

  const extralProps = useMemo(() => ({ extral: '扩展props' }), []);

  return (
    <DefaultCtx.Provider value={ctx}>
      <pre>
        {JSON.stringify(getPageState(), null, 2)}
      </pre>
      <div>
        {newComps.map((comps, i) => {
          return comps.map((Comp, ii) => {
            return (<Comp key={i + ii} extralProps={extralProps} />);
          });
        })}
      </div>
      <FromWrapFactory>
        <LayoutRenderer
          layoutNode={actualRenderComponentList}
          componentRenderer={({ layoutNodeItem }) => {
            const { id: compId, Comp } = layoutNodeItem;

            /** 可以额外添加属性, 例如权限控制的属性传入 */
            return <Comp key={compId} {...extralProps}/>;
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
