import {
  FoundationType, ComplexType, TypeOfIUBDSL, Schemas
} from '@iub-dsl/definition';

const genOrder = Math.floor(Math.random() * 10000);
const genAge = Math.floor(Math.random() * 100);

/**
 * 临时转换函数
 */
export const tempFnCompTransform = (compInfo, i) => {
  return {
    ...compInfo,
    label: compInfo.title,
    compCode: compInfo.id,
    compId: compInfo.id,
    unit: '单位',
    placeholder: '请输入内容?',
    // value: '文本框内容',
    tipContent: `${compInfo.title}Tip:${i}`,
  };
};

export const addConf = (key, index): any => ({
  value: `@(schemas).${key}${index}`,
  actions: {
    onChange: {
      type: 'actionRef',
      actionID: `@(actions).${key}${index}`
    }
  }
});
export const testDemo: TypeOfIUBDSL = {
  sysRtCxtInterface: {} as any,
  schemas: {
    entity_25: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string,
      defaultVal: `张三${genOrder}`,
      desc: '用户名'
    },
    entity_26: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string,
      defaultVal: `西湖区湖底公园1${genOrder}~@!!~`,
      desc: '用户描述'
    },
    entity_27: {
      type: ComplexType.structArray,
      struct: {
        sdId0: {
          fieldMapping: "tableId1.fieldId1",
          type: FoundationType.string,
          desc: '用户ID',
        },
        sdId1: {
          fieldMapping: "tableId1.fieldId1",
          type: FoundationType.string,
          desc: '用户名'
        },
        sdId2: {
          fieldMapping: "tableId1.fieldId1",
          type: FoundationType.string,
          desc: '用户描述'
        },
        sdId3: {
          fieldMapping: "tableId1.fieldId1",
          type: FoundationType.string,
          desc: '用户年龄'
        },
      }
    },
    entity_28: {
      fieldMapping: "tableId1.fieldId1",
      type: FoundationType.string,
      defaultVal: `${genAge}`,
      desc: '用户年龄'
    },
  },
  metadataCollection: {} as any,
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
      label: "用户地址",
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
      id: "entity_00", label: "性别", type: "componentRef", compType: "Input", title: "输入框"
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
    entity_02: {
      id: "entity_02",
      label: "按钮",
      type: "componentRef",
      compType: "Button",
      title: "按钮",
      text: '查表',
      actions: {
        onClick: {
          type: 'actionRef',
          actionID: `@(actions).entity_02`
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
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '用户地址',
          dataIndex: 'address',
          key: 'address',
        },
      ],
      dataSource: '@(schemas).entity_27'
    },
  } as any,
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
    entity_27: {
      type: 'updateState',
      changeMapping: '@(schemas).entity_27'
    },
    entity_02: {
      type: 'APBDSLCURD',
      actionName: 'TableSelect',
      businesscode: '34562',
      actionList: {
        apbA1: {
          type: 'TableSelect',
          table: 'test_user_k',
        }
      },
      actionStep: ['apbA1']
    },
    entity_01: {
      type: 'APBDSLCURD',
      actionName: 'TableInsert',
      businesscode: '34562',
      actionList: {
        apbA1: {
          type: 'TableInsert',
          table: 'test_user_k',
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
                aliasField: 'address',
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
      //     aliasField: 'address',
      //     collectField: '@(schemas).entity_26'
      //   },
      //   {
      //     aliasField: 'age',
      //     collectField: '@(schemas).entity_28'
      //   },
      // ]
    }
  } as any,
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
  } as any,
  pageID: "testPage",
  name: "测试页面",
  type: "config"
};
