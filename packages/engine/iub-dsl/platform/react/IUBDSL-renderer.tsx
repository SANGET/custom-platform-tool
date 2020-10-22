import React, { useImperativeHandle } from 'react';
import { IUBDSLParser, IUBDSLRuntimeContainer } from '@iub-dsl/engine';

const resolvedDsl: {
  [pageId: string]: any; // IUB_DSL解析结果
} = {

};

/** IUB-DSL引擎对外暴露的组件 */
const IUBDSLRenderer = React.memo<{dsl: any}>(({ dsl }) => {
  const { pageID } = dsl;
  if (typeof pageID !== 'string') {
    return <ErrorRenderer msg='IUB-DSL Data Error'/>;
  }

  let dslParseRes;
  let ActualRender = <ErrorRenderer/>;
  try {
    if (!(dslParseRes = resolvedDsl[pageID])) {
      dslParseRes = IUBDSLParser({ dsl });
      /** 现在先不缓存解析结果 */
      // resolvedDsl[dsl.pageID] = dslParseRes;
    }
  } catch (e) {
    console.error(e);
    ActualRender = (<ErrorRenderer msg='IUB-DSLEngine Parser Error?'/>);
  }

  if (dslParseRes) {
    ActualRender = <IUBDSLRuntimeContainer dslParseRes={dslParseRes} />;
  }

  return ActualRender;
},
// () => {
  // // TODO: 记得删除
  // if (process.env.NODE_ENV === 'development') {
  //   return true;
  // }
  // return false;
// }
);

const ErrorRenderer = ({ msg = '未知' }) => (<div>渲染错误; 错误信息: {msg}</div>);

export {
  IUBDSLRenderer
};
