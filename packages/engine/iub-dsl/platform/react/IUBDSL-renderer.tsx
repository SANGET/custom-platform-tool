import React from 'react';
import { IUBDSLParser, IUBDSLRuntimeContainer } from '@iub-dsl/engine';
import { testDemo } from '@iub-dsl/demo/base-reference';

const resolvedDsl: {
  [pageId: string]: any; // IUB_DSL解析结果
} = {

};

/** IUB-DSL引擎对外暴露的组件 */
const IUBDSLRenderer = React.memo<{dsl: any}>(({ dsl }) => {
  const { pageID } = dsl;
  if (typeof pageID !== 'string') {
    dsl = testDemo;
    // return <ErrorRenderer msg='IUB-DSL Data Error'/>;
  }
  // 临时添加schemas
  // dsl.schemas = testSchemas;

  let dslParseRes;
  try {
    if (!(dslParseRes = resolvedDsl[pageID])) {
      dslParseRes = IUBDSLParser({ dsl });
      // resolvedDsl[dsl.pageID] = dslParseRes;
    }
  } catch (e) {
    console.error(e);
    return <ErrorRenderer msg='IUB-DSLEngine Parser Error?'/>;
  }

  if (dslParseRes) {
    return <IUBDSLRuntimeContainer dslParseRes={dslParseRes} />;
  }
  return <ErrorRenderer/>;
},
//  () => {
  // // TODO: 记得删除
  // if (process.env.NODE_ENV === 'development') {
  //   return true;
  // }
  // return false;
// }
// eslint-disable-next-line function-paren-newline
);

const ErrorRenderer = ({ msg = '未知' }) => (<div>渲染错误; 错误信息: {msg}</div>);

export {
  IUBDSLRenderer
};
