/* eslint-disable no-param-reassign */
import React, { lazy, Suspense } from 'react';
import LayoutParser from './layout-parser';
import { useIUBStore } from './state-manage';
import { compose, Enhancer } from './utils';
// import { InitPageState } from './schemas/schemas-parser';

const IUBDSLRuntimeContainer = ({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes,
    schemas, mappingEntity,
    getSchemasInitValue,
    originSchemas
  } = dslParseRes;
  // console.log(dslParseRes);
  const { getState, setState } = useIUBStore(getSchemasInitValue);

  const get = (getParam) => {
    const originState = getState(getParam);
    console.log(originSchemas);
    console.log(originState);

    return originState;
  };

  const IUBRuntimeContext = {
    stateManage: {
      setState,
      getState: get
    }
  };
  dslParseRes.bindComponent = (compId) => componentParseRes[compId](IUBRuntimeContext);

  // return <pre>{JSON.stringify(getState(), null, 2)}</pre>;

  // return <pre>{JSON.stringify(getState({
  //   dId4: 'dId4',
  //   d4: 'dId4[1].sdId1',
  //   d5: 'dId5.sdId2',
  //   d6: 'dId5.sdId2.ssdId1',
  // }), null, 2)}</pre>;
  return LayoutParser({
    layoutNode: layoutContent.content,
    componentWrapper: (Comp, { id, idx }) => {
      // console.log(id, idx);
      return <div key={id} style={{ margin: '5px' }}>{Comp}</div>;
    }
  }, dslParseRes);
};

export default IUBDSLRuntimeContainer;
