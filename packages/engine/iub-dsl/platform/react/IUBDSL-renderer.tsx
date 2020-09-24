import React, { useState, useReducer, useMemo } from 'react';
// import { IUBDSLParser, IUBDSLRuntimeContainer } from '../../engine';
// import { IUBDSLParser, IUBDSLRuntimeContainer } from '@iub-dsl/engine';

// const resolvedDsl: {
//   [pageId: string]: any; // IUB_DSL解析结果
// } = {

// };

const IUBDSLRenderer = ({ dsl }) => {
  const { id: pageId } = dsl;

  console.log(1);

  if (typeof pageId !== 'string') {
    console.log(1);
    // return <ErrorRenderer msg='页面数据有误!'/>;
  }

  let dslParseRes;
  try {
    // if (!(dslParseRes = resolvedDsl[pageId])) {
    // dslParseRes = IUBDSLParser({ dsl });
    // }
  } catch (e) {
    // return <ErrorRenderer msg='解析错误?'/>;
  }

  if (dslParseRes) {
    // return <IUBDSLRuntimeContainer dslParseRes={dslParseRes}/>;
  }
  // return <ErrorRenderer/>;
};

// const ErrorRenderer = ({ msg = '未知' }) => (<div>渲染错误; 错误信息: {msg}</div>);

export {
  IUBDSLRenderer
};
