/* eslint-disable no-param-reassign */
import React, { lazy, Suspense, useReducer } from 'react';
import { count } from 'console';
import LayoutParser from './layout-parser';
import { useIUBStore } from './state-manage';
import { compose, Enhancer } from './utils';
// import { InitPageState } from './schemas/schemas-parser';

function init(initialCount) {
  return { count: initialCount };
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({ type: 'reset', payload: initialCount })}
      >
        Reset
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}

const IUBDSLRuntimeContainer = ({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes,
    schemas, mappingEntity,
    getSchemasInitValue,
    originSchemas
  } = dslParseRes;

  return <Counter
    initialCount={10}
  />;

  // 监测处理完成得改变, 渲染组件
  // const renderedChild = useMemo(() => {
  //   if (shouldHandleStateChanges) {
  //     return (
  //       <ContextToUse.Provider value={overriddenContextValue}>
  //         {renderedWrappedComponent}
  //       </ContextToUse.Provider>
  //     )
  //   }

  //   return renderedWrappedComponent
  // }, [ContextToUse, renderedWrappedComponent, overriddenContextValue])

  // return renderedChild

  // console.log(dslParseRes);
  // const { getState, setState } = useIUBStore(getSchemasInitValue);

  // const get = (getParam) => {
  //   const originState = getState(getParam);
  //   console.log(originSchemas);
  //   console.log(originState);

  //   return originState;
  // };

  // const IUBRuntimeContext = {
  //   stateManage: {
  //     setState,
  //     getState: get
  //   }
  // };
  // dslParseRes.bindComponent = (compId) => componentParseRes[compId](IUBRuntimeContext);

  // return <pre>{JSON.stringify(getState(), null, 2)}</pre>;

  // return <pre>{JSON.stringify(getState({
  //   dId4: 'dId4',
  //   d4: 'dId4[1].sdId1',
  //   d5: 'dId5.sdId2',
  //   d6: 'dId5.sdId2.ssdId1',
  // }), null, 2)}</pre>;
  // return LayoutParser({
  //   layoutNode: layoutContent.content,
  //   componentWrapper: (Comp, { id, idx }) => {
  //     // console.log(id, idx);
  //     return <div key={id} style={{ margin: '5px' }}>{Comp}</div>;
  //   }
  // }, dslParseRes);
};

export default IUBDSLRuntimeContainer;
