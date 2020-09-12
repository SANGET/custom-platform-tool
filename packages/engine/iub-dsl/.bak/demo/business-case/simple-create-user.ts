import { TypeOfIUBDSL } from "..";

const SimpleCreateUser: TypeOfIUBDSL = {
  id: "SimpleCreateUser",
  type: "config",
  name: "SimpleCreateUser",

  /** 元数据映射集合 [数据源关系枢纽] */
  metadataCollection: {
    dataSource: {
      userTable_UUID: {
        type: 'general',
        database: '-',
        tableName: 'user',
        columns: {
          field_UUID1: {
            field: 'username',
            type: 'string',
            len: 32
          },
          field_UUID2: {
            field: 'age',
            type: 'int',
            len: 3,
          },
          field_UUID3: {
            field: 'deparmentId',
            type: 'string',
            len: 32
          }
        },
      },
      deparment_UUID: {
        type: 'general',
        database: '-',
        tableName: 'deparment',
        columns: {
          field_UUID1: {
            type: 'string',
            len: 32,
            field: 'id'
          },
          field_UUID2: {
            type: 'string',
            len: 32,
            field: 'deparment_name'
          },
          field_UUID3: {
            type: 'string',
            len: 32,
            field: 'pid'
          },
        }
      },
      location_UUID: {
        type: 'general',
        database: '-',
        tableName: 'location',
        columns: {
          field_UUID1: {
            type: 'string',
            len: 32,
            field: 'id'
          },
          field_UUID2: {
            type: 'string',
            len: 32,
            field: 'location_name'
          },
          field_UUID3: {
            type: 'string',
            len: 32,
            field: 'pid'
          },
          field_UUID4: {
            type: 'string',
            len: 2,
            field: 'location_type'
          },
        }
      },
      dictionary_UUID: {
        type: "general",
        database: "-",
        tableName: "dictionary",
        columns: {
          data_UUID0: {
            field: 'id',
            type: 'string',
            len: 32
          },
          data_UUID1: {
            field: 'dictionaryName',
            type: 'string',
            len: 6,
          },
          data_UUID2: {
            field: 'dictionaryType',
            type: 'string',
            len: 6,
          },
        },
      },
    },
  },

  /** 系统上下文接口 */
  sysRtCxtInterface: {
    exposeVar: {
      // TODO: 数组是否能支持？如何支持？
      // 输出key，接受key
      'userFrom.data_UUID1': 'var1',
      'userFrom.data_UUID2': 'var2',
    },
    refVar: {
      pageContext_UUID1: 'pageID.var1',
      // 'userFrom.data_UUID1': 'pageID.var1',
      // 'userFrom.data_UUID1': 'pageID.pageSchemasId.data_UUID1',
    },
    output: {
      type: "schema",
      struct: {
        'userFrom.data_UUID1': 'string',
        'userFrom.data_UUID2': 'int',
      }
    },
    // TODO: 挂在context上有声明还是不需要。？
    input: {
      type: "schema",
      struct: {
        pageContext_UUID2: 'string'
      }
    }
  },

  /** 数据模型 */
  schemas: {
    data_UUID1: {
      type: 'string',
      defaultVal: '张三',
      fieldMapping: 'userTable_UUID.field_UUID1',
    },
    data_UUID2: {
      type: 'num',
      defaultVal: 0,
      fieldMapping: 'userTable_UUID.field_UUID2',
    },
    data_UUID3: { // 部门
      type: 'string',
      fieldMapping: 'userTable_UUID.field_UUID3',
    },
    data_UUID4: { // 建筑物
      type: 'structObject',
      // 过滤、显示、实际值多个
      struct: {
        dataUUID_1: {
          type: 'string',
          alias: 'showValue',
          fieldMapping: 'location_UUID.field_UUID2',
        },
        dataUUID_2: {
          type: 'string',
          alias: 'value',
          fieldMapping: 'location_UUID.field_UUID1'
        },
      }
    },
    data_UUID5: { // 楼层
      type: 'structObject',
      struct: {
        dataUUID_1: {
          type: 'string',
          alias: 'showValue',
          fieldMapping: 'location_UUID.field_UUID2',
        },
        dataUUID_2: {
          type: 'string',
          alias: 'value',
          fieldMapping: 'location_UUID.field_UUID1'
        },
      }
    },
    data_UUID6: { // 区域
      type: 'structObject',
      struct: {
        dataUUID_1: {
          type: 'string',
          alias: 'showValue',
          fieldMapping: 'location_UUID.field_UUID2',
        },
        dataUUID_2: {
          type: 'string',
          alias: 'value',
          fieldMapping: 'location_UUID.field_UUID1'
        },
      }
    },
    data_UUID7: {
      type: 'structArray',
      struct: {
        UUID_1: {
          type: 'string',
          fieldMapping: ''
        },
        UUID_2: {
          type: 'string',
          fieldMapping: ''
        },
        UUID_3: {
          type: 'string',
          fieldMapping: ''
        }
      }
    },
    // 运行时候的数据
    data_UUID: {
      type: 'boolean',
      fieldMapping: 'userTableId.field_UUID2',
      defaultVal: false
    },
    data_UUID8: {
      type: 'structArray',
      struct: {
        UUID_1: { // 建筑物
          type: 'structObject',
          struct: {
            dataUUID_1: {
              type: 'string',
              alias: 'showValue',
              fieldMapping: 'location_UUID.field_UUID2',
            },
            dataUUID_2: {
              type: 'string',
              alias: 'value',
              fieldMapping: 'location_UUID.field_UUID1'
            },
          }
        },
        UUID_2: { // 楼层
          type: 'structObject',
          struct: {
            dataUUID_1: {
              type: 'string',
              alias: 'showValue',
              fieldMapping: 'location_UUID.field_UUID2',
            },
            dataUUID_2: {
              type: 'string',
              alias: 'value',
              fieldMapping: 'location_UUID.field_UUID1'
            },
          }
        },
        UUID_3: { // 区域
          type: 'structObject',
          struct: {
            dataUUID_1: {
              type: 'string',
              alias: 'showValue',
              fieldMapping: 'location_UUID.field_UUID2',
            },
            dataUUID_2: {
              type: 'string',
              alias: 'value',
              fieldMapping: 'location_UUID.field_UUID1'
            },
          }
        }
      }
    },
    data_UUID9: {
      type: 'structObject',
      struct: {
        label: {
          type: 'string',
          fieldMapping: ''
        },
        value: {
          type: 'string',
          fieldMapping: ''
        }
      }
    }
  },

  /** 布局信息 */
  layoutContent: {
    type: "general",
    content: [
      {
        id: "containerUUID1",
        type: "container",
        layout: {
          type: "flex",
          props: {
            justifyContent: "start",
          },
        },
        // TODO: 布局解析？
        body: [
          {
            id: "controlId1",
            type: "componentRef",
            componentID: "compUUID1",
          },
          {
            id: "controlId2",
            type: "componentRef",
            componentID: "compUUID2",
          },
          {
            id: "controlId3",
            type: "componentRef",
            componentID: "compUUID3",
          },
        ],
      },
      {
        id: "containerUUID2",
        type: "container",
        layout: {
          type: "flex",
          props: {
            justifyContent: "start",
          },
        },
        // TODO: 布局解析？
        body: [
          {
            id: "controlId1",
            type: "componentRef",
            componentID: "compUUID4",
          },
          {
            id: "controlId2",
            type: "componentRef",
            componentID: "compUUID5",
          },
          {
            id: "controlId3",
            type: "componentRef",
            componentID: "compUUID6",
          },
        ],
      },
      {
        id: "containerUUID3",
        type: "container",
        layout: {
          type: "flex",
          props: {
            justifyContent: "start",
          },
        },
        body: [
          {
            id: "controlId1",
            type: "componentRef",
            componentID: "compUUID0",
          },
        ],
      },
      {
        id: "containerUUID4",
        type: "container",
        runtimeField: 'data_UUID', // TODO: 测试先行,后面再想
        layout: {
          type: "flex",
          props: {
            justifyContent: "start",
            visibility: false
          },
        },
        body: [
          {
            id: "controlId1",
            type: "componentRef",
            componentID: "compUUID7",
          },
        ],
      },
    ],
  },

  /** 组件集合 */
  componentsCollection: {
    compUUID1: {
      id: "compUUID1",
      type: "component",
      component: {
        type: 'Input',
        field: '@(schemas)data_UUID1',
        label: '姓名'
      },
      props: {},
      actions: {
        onChange: {
          type: "actionRef",
          actionID: "changeUUID1",
        }
      },
    },
    compUUID2: {
      id: "compUUID2",
      type: "component",
      component: {
        type: 'Input',
        field: '@(schemas)data_UUID2',
        label: '年龄'
      },
      props: {},
      actions: {
        onChange: {
          type: "actionRef",
          actionID: "changeUUID1",
        },
        onFocus: {
          type: "actionRef",
          actionID: "validAgeRules",
        },
      },
    },
    compUUID3: {
      id: "compUUID3",
      type: "component",
      component: {
        type: 'Input',
        field: '@(schemas)data_UUID3',
        label: '部门'
      },
      props: {
        readOnly: true,
        // disabled: true
      },
      actions: {
        // onChange: {
        //   type: "actionRef",
        //   actionID: "changeUUID1",
        // },
        onClick: {
          actionID: 'clickUUID1',
          type: 'actionRef',
        }
      },
    },
    compUUID4: {
      id: "compUUID4",
      type: "component",
      component: {
        type: 'Input',
        field: '@(schemas)data_UUID4',
        label: '建筑物'
      },
      props: {},
      actions: {},
    },
    compUUID5: {
      id: "compUUID5",
      type: "component",
      component: {
        type: 'Input',
        field: '@(schemas)data_UUID5',
        label: '楼层'
      },
      props: {},
      actions: {},
    },
    compUUID6: {
      id: "compUUID6",
      type: "component",
      component: {
        type: 'Input',
        field: '@(schemas)data_UUID6',
        label: '区域'
      },
      props: {},
      actions: {},
    },
    compUUID0: {
      id: "compUUID0",
      type: "component",
      component: {
        type: "Button",
        text: "提交",
      },
      props: {},
      actions: {
        onClick: {
          type: "actionRef",
          actionID: "clickUUID1",
        },
      },
    },
    compUUID7: {
      id: 'compUUID7',
      type: 'component',
      component: {
        type: 'Selector',
        dataSource: '@(schemas)data_UUID8',
        field: '@(schemas)data_UUID9',
      },
      props: {},
      // actions: {
      //   onChange: {
      //     type: 'actionRef',
      //     actionID: ''
      //   }
      // }
    }
  },

  /** 动作集合 */
  actionsCollection: {
    validAgeRules: {
      flowItems: {
        f1: {
          variable: 'var1',
          expression: '@showTip.success(@userFrom.data_UUID2, "年龄符合标准!")',
          isReturn: true,
        },
        f2: {
          variable: "var2",
          expression: '@showTip.error("年龄不小于0。")',
          isReturn: true,
        },
        f3: {
          variable: "var3",
          expression: "@showTip.warn(“年龄小于14岁请注意童工。”)",
          isReturn: true,
        },
        f4: {
          variable: "var4",
          expression: '@showTip.warn("年龄过大注意劳动力不足。")',
          isReturn: true,
        },
      },
      flowCondition: {
        fe0: {
          variable: 'feVar0',
          expression: '@userFrom.data_UUID2 > 0'
        },
        fe1: {
          variable: 'feVar1',
          expression: '@userFrom.data_UUID2 > 14 && @userFrom.data_UUID2 <= 100'
        },
        fe2: {
          variable: 'feVar2',
          expression: '@userFrom.data_UUID2 > 100'
        },
      },
      // TODO: ?
      flowControl: `
        if(#feVar0) {
          if (#feVar1) {
            return #f1;
          } else if (#feVar2) {
            return #f4;
          } else {
            return #f3
          }
        } else {
          return #f2
        }
      `,
    },
    clickUUID1: {
      flowItems: {
        f1: {
          variable: "var1",
          expression: "@vaild(@validUserFrom)",
        },
        f2: {
          variable: "var2",
          expression: "@insert(@userFrom)",
        },
        f3: {
          variable: 'var3',
          expression: '@showTip.warn("表单校验失败！")'
        }
      },
      flowCondition: {},
      flowControl: `
        if(#var1) {
          #f2;
          !showTip.sysDefault; // ?
        } else {
          #f3;
        }
      `,
    },
    changeUUID1: {
      flowCondition: {},
      flowItems: {},
      flowControl: ``
    }
  },

  /** 关系集合 */
  relationshipsCollection: {
    dataCollection: {
      user: {
        // 新增、修改、详情
        group: [
          {
            schemasMapping: '@(schemas)data_UUID1',
          },
          {
            schemasMapping: '@(schemas)data_UUID2',
          },
          {
            schemasMapping: '@(schemas)data_UUID3',
          },
        ],
      }
    },
    dataChanged: {}
  }
};

export default SimpleCreateUser;

// 1. 打开隐藏页面、加载数据、选择数据、改变数据、数据变更关系
// 2. 重新思考数据与组件关系的interface
