import React, { useState, useReducer, useMemo } from 'react';
// import { IUBDSLParser, IUBDSLRuntimeContainer } from '../../engine';
import { IUBDSLParser, IUBDSLRuntimeContainer } from '@iub-dsl/engine';

import { FoundationType } from '@iub-dsl/definition';
import { testSchemas } from '../../demo/business-case/location';

const resolvedDsl: {
  [pageId: string]: any; // IUB_DSL解析结果
} = {

};

const tempDsl = {
  sysRtCxtInterface: {},
  schemas: {
    entity_25: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string
    },
    entity_26: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string
    },
    entity_27: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string
    },
    entity_28: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string
    },
  },
  metadataCollection: {},
  relationshipsCollection: {},
  componentsCollection: {
    entity_25: {
      id: "entity_25",
      label: "test文本框1",
      type: "componentRef",
      compType: "FormInput",
      title: "文本框",
      compCode: "entity_25",
      unit: "单位25",
      placeholder: "请输入文本框内容25?",
      tipContent: `文本框内容Tip: $0`,
      value: `@(schemas).entity_25`,
      actions: {
        onChange: {
          type: 'actionRef',
          actionID: `@(actions).entity_25`
        }
      }
    },
    entity_26: {
      id: "entity_26",
      label: "test文本框2",
      type: "componentRef",
      compType: "FormInput",
      title: "文本框",
      compCode: "entity_26",
      unit: "单位26",
      placeholder: "请输入文本框内容26?",
      tipContent: `文本框内容Tip: $1`,
      value: `@(schemas).entity_26`,
      actions: {
        onChange: {
          type: 'actionRef',
          actionID: `@(actions).entity_26`
        }
      }
    },
    entity_27: {
      id: "entity_27", label: "表格", type: "componentRef", compType: "NormalTable", title: "文本框"
    },
    entity_00: {
      id: "entity_27", label: "输入框", type: "componentRef", compType: "Input", title: "输入框"
    },
    entity_28: {
      id: "entity_28",
      label: "test文本框3",
      type: "componentRef",
      compType: "FormInput",
      title: "文本框",
      compCode: "entity_28",
      unit: "单位2",
      placeholder: "请输入文本框内容25?",
      tipContent: `文本框内容Tip: $2`,
      value: `@(schemas).entity_28`,
      actions: {
        onChange: {
          type: 'actionRef',
          actionID: `@(actions).entity_28`
        }
      }
    },
  },
  actionsCollection: {
    entity_25: {
      type: 'updateState',
      // changeMapping?: {
      // [mapFrom: string]: string
      // }
      changeTarget: '@(schemas).entity_25'
    },
    entity_26: {
      type: 'updateState',
      changeTarget: '@(schemas).entity_26'
    },
    entity_28: {
      type: 'updateState',
      changeTarget: '@(schemas).entity_28'
    }
  },
  layoutContent: {
    type: "general",
    content: [{
      id: "entity_25", label: "文本框", type: "componentRef", compType: "FormInput", title: "文本框", componentID: "entity_25", refID: "entity_25"
    }, {
      id: "entity_26", label: "文本框", type: "componentRef", compType: "FormInput", title: "文本框", componentID: "entity_26", refID: "entity_26"
    }, {
      id: "entity_27", label: "表格", type: "componentRef", compType: "NormalTable", title: "文本框", componentID: "entity_27", refID: "entity_27"
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
    return <IUBDSLRuntimeContainer dslParseRes={dslParseRes}/>;
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
