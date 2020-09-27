import React, { useState, useReducer, useMemo } from 'react';
// import { IUBDSLParser, IUBDSLRuntimeContainer } from '../../engine';
import { IUBDSLParser, IUBDSLRuntimeContainer } from '@iub-dsl/engine';

import { testSchemas } from '../../demo/business-case/location';

const resolvedDsl: {
  [pageId: string]: any; // IUB_DSL解析结果
} = {

};

const tempDsl = {
  sysRtCxtInterface: {},
  schemas: testSchemas,
  metadataCollection: {},
  relationshipsCollection: {},
  componentsCollection: {
    entity_25: {
      id: "entity_25", label: "test文本框1", type: "componentRef", compType: "FormInput", title: "文本框"
    },
    entity_26: {
      id: "entity_26", label: "文本框2", type: "componentRef", compType: "FormInput", title: "文本框"
    },
    entity_27: {
      id: "entity_27", label: "表格", type: "componentRef", compType: "Table", title: "文本框"
    },
    entity_28: {
      id: "entity_28", label: "文本框3", type: "componentRef", compType: "FormInput", title: "文本框"
    }
  },
  actionsCollection: {},
  layoutContent: {
    type: "general",
    content: [{
      id: "entity_25", label: "文本框", type: "componentRef", compType: "FormInput", title: "文本框", componentID: "entity_25", refID: "entity_25"
    }, {
      id: "entity_26", label: "文本框", type: "componentRef", compType: "FormInput", title: "文本框", componentID: "entity_26", refID: "entity_26"
    }, {
      id: "entity_27", label: "表格", type: "componentRef", compType: "Table", title: "文本框", componentID: "entity_27", refID: "entity_27"
    }, {
      id: "entity_28", label: "文本框", type: "componentRef", compType: "FormInput", title: "文本框", componentID: "entity_28", refID: "entity_28"
    }]
  },
  pageID: "testPage",
  name: "测试页面",
  type: "config"
};

/** IUB-DSL引擎对外暴露的组件 */
const IUBDSLRenderer = React.memo<{dsl: any}>(({ dsl }) => {
  const { pageID } = dsl;

  if (typeof pageID !== 'string') {
    dsl = tempDsl;
    // return <ErrorRenderer msg='页面IUB-DSL数据有误!'/>;
  }
  // 临时添加schemas
  dsl.schemas = testSchemas;

  let dslParseRes;
  try {
    if (!(dslParseRes = resolvedDsl[pageID])) {
      dslParseRes = IUBDSLParser({ dsl });
      resolvedDsl[dsl.pageID] = dslParseRes;
    }
  } catch (e) {
    console.error(e);

    return <ErrorRenderer msg='解析错误?'/>;
  }

  if (dslParseRes) {
    return <IUBDSLRuntimeContainer dslParseRes={dslParseRes}/>;
  }
  return <ErrorRenderer/>;
});

const ErrorRenderer = ({ msg = '未知' }) => (<div>渲染错误; 错误信息: {msg}</div>);

export {
  IUBDSLRenderer
};
