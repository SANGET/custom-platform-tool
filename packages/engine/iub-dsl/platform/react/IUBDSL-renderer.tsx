import React from 'react';
import { IUBDSLParser, IUBDSLRuntimeContainer } from '@iub-dsl/engine';

import { FoundationType } from '@iub-dsl/definition';
import { testSchemas } from '../../demo/business-case/location';

const resolvedDsl: {
  [pageId: string]: any; // IUB_DSL解析结果
} = {

};

const genOrder = Math.floor(Math.random() * 10000);
const genAge = Math.floor(Math.random() * 100);

const tempDsl = {
  sysRtCxtInterface: {},
  schemas: {
    entity_25: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string,
      defaultVal: `张三${genOrder}`,
    },
    entity_26: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string,
      defaultVal: `${genOrder}描述信息描述描述描述~@!!~`,
    },
    entity_27: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string
    },
    entity_28: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string,
      defaultVal: `${genAge}`,

    },
  },
  metadataCollection: {},
  relationshipsCollection: {},
  componentsCollection: {
    entity_25: {
      id: "entity_25",
      label: "用户名",
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
      label: "用户描述",
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
    entity_00: {
      id: "entity_27", label: "性别", type: "componentRef", compType: "Input", title: "输入框"
    },
    entity_28: {
      id: "entity_28",
      label: "用户年龄",
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
    entity_01: {
      id: "entity_01",
      label: "按钮",
      type: "componentRef",
      compType: "Button",
      title: "按钮",
      text: '提交',
      actions: {
        onClick: {
          type: 'actionRef',
          actionID: `@(actions).entity_01`
        },
        onChange: {
          type: 'actionRef',
          actionID: `@(actions).entity_25`
        }
      }
    },
    entity_27: {
      id: "entity_27",
      label: "表格",
      type: "componentRef",
      compType: "NormalTable",
      title: "文本框",
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '住址',
          dataIndex: 'address',
          key: 'address',
        },
      ],
      dataSource: [
        {
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
        },
      ]
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
    },
    entity_01: {
      type: 'APBDSLCURD',
      businesscode: '34562',
      actionList: {
        apbA1: {
          type: 'TableInsert',
          table: 'test_user',
          fieldMapping: {
            type: 'dataCollection',
            collectionType: 'structObject',
            struct: [
              {
                aliasField: 'id',
                collectField: '$ID()',
              },
              {
                aliasField: 'username',
                collectField: '@(schemas).entity_25'
              },
              {
                aliasField: 'description',
                collectField: '@(schemas).entity_26'
              },
              {
                aliasField: 'age',
                collectField: '@(schemas).entity_28'
              },
            ]
          },
        }
      },
      actionStep: ['apbA1']
      // type: 'dataCollection',
      // collectionType: 'structArray',
      // struct: [
      //   '@(schemas).entity_25',
      //   '@(schemas).entity_26',
      //   '@(schemas).entity_28',
      // ]
      // collectionType: 'structObject',
      // struct: [
      //   {
      //     aliasField: 'username',
      //     collectField: '@(schemas).entity_25'
      //   },
      //   {
      //     aliasField: 'description',
      //     collectField: '@(schemas).entity_26'
      //   },
      //   {
      //     aliasField: 'age',
      //     collectField: '@(schemas).entity_28'
      //   },
      // ]
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
