import { TypeOfIUBDSL } from "..";

const CreteUser: TypeOfIUBDSL = {
  id: "CreteUser",
  type: "config",
  name: "CreteUser",

  /** 元数据映射集合 [数据源关系枢纽] */
  metadataCollection: {
    dataSource: {
      userTableId: {
        type: "general",
        database: "-",
        tableName: "user",
        columns: {
          data_UUID0: {
            field: 'id',
            type: 'string',
            len: 32
          },
          data_UUID1: {
            field: 'username',
            type: 'string',
            len: 32
          },
          data_UUID2: {
            field: 'age',
            type: 'int',
            len: 3,
          },
          data_UUID3: {
            field: 'deparmentId',
            type: 'string',
            len: 32,
          },
        },
      },
      deparmentTableId: {
        type: "general",
        database: "-",
        tableName: "deparment",
        columns: {
          data_UUID0: {
            field: 'id',
            type: 'string',
            len: 32
          },
          data_UUID1: {
            field: 'deparmentname',
            type: 'string',
            len: 32
          },
          data_UUID2: {
            field: 'pid',
            type: 'string',
            len: 32
          },
          data_UUID3: {
            field: 'locationId',
            type: 'string',
            len: 32
          },
        },
      },
      locationTableId: {
        type: "general",
        database: "-",
        tableName: "location",
        columns: {
          data_UUID0: {
            field: 'id',
            type: 'string',
            len: 32
          },
          data_UUID1: {
            field: 'locationname',
            type: 'string',
            len: 32
          },
          data_UUID2: {
            field: 'pid',
            type: 'string',
            len: 32
          },
          data_UUID3: {
            field: 'type',
            type: 'string',
            len: 2
          }
        }
      },
      dictionaryTableId: {
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
    dataSourceRelation: {
      userTableId: {
        type: "tableRef",
        // 当前表的uuid和其他表的引用关系
        quoteRef: {
          // data_UUID3: 'deparmentTableId.data_UUID0'
          data_UUID3: {
            // ??
            connectKey: 'deparmentTableId.data_UUID0', // 链接key
            key: 'deparmentTableId.data_UUID0', // 存储值
            value: 'deparmentTableId.data_UUID1' // 显示值
          }
        }
      },
      deparmentTableId: {
        type: "tableRef",
        parentTable: {
          data_UUID2: {
            connectKey: 'deparmentTableId.data_UUID0', // 链接key
            key: 'deparmentTableId.data_UUID0', // 存储值
            value: 'deparmentTableId.data_UUID1' // 显示值
          }
        },
        quoteRef: {
          data_UUID3: {
            connectKey: 'locationTableId.data_UUID0', //
            key: 'locationTableId.data_UUID0',
            value: 'locationTableId.data_UUID1',
          }

        }
      },
      locationTableId: {
        type: "tableRef",
        parentTable: {
          data_UUID2: {
            connectKey: 'locationTableId.data_UUID0', // 链接key
            key: 'locationTableId.data_UUID0', // 存储值
            value: 'locationTableId.data_UUID1' // 显示值
          }
        },
        quoteRef: {
          data_UUID3: {
            connectKey: 'dictionaryTableId.data_UUID2', //
            key: 'dictionaryTableId.data_UUID0',
            value: 'dictionaryTableId.data_UUID1',
          }

        }
      }
    }
  },

  /** 数据模型 */
  // TODO: 引用table和schemas的差别
  schemas: {
    flow: {},
    page: {
      userFromSu: {
        type: "object",
        struct: {
          data_UUID1: { // 用户名
            type: 'string',
            fieldMapping: 'userTableId.data_UUID1',
          },
          data_UUID2: { // 年龄
            type: 'num',
            fieldMapping: 'userTableId.data_UUID2',
          },
          data_UUID3: { // 所属部门
            type: 'string',
            fieldMapping: '@deparmentRef.data_UUID0',
          },
          data_UUID4: { // 建筑物
            type: 'string',
            fieldMapping: '@locationRef.data_UUID0',
          },
          data_UUID5: { // 楼层
            type: 'string',
            fieldMapping: '@locationRef.data_UUID0',
          },
          data_UUID6: { // 区域
            type: 'string',
            fieldMapping: '@locationRef.data_UUID0',
          },
        },
      },
      userFrom: {
        type: "object",
        struct: {
          data_UUID1: {
            type: 'string',
            fieldMapping: 'userTableId.data_UUID1',
          },
          data_UUID2: {
            type: 'num',
            fieldMapping: 'userTableId.data_UUID2',
          },
          data_UUID3: {
            type: 'string',
            fieldMapping: '@deparmentRef.data_UUID0',
          },
          // 是否需要引入？？成组
        },
      },
      deparmentRef: {
        type: "object",
        struct: {
          data_UUID0: {
            type: 'string',
            fieldMapping: 'deparmentTableId.data_UUID0',
          },
          data_UUID1: {
            type: 'string',
            fieldMapping: 'deparmentTableId.data_UUID1'
          },
          // TODO: 子父的？
          data_UUID2: {
            type: 'string',
            fieldMapping: 'deparmentTableId.data_UUID2'
          },
          // TODO: 显示
          data_UUID3: {
            type: 'string',
            fieldMapping: '@locationRef.data_UUID0'
          },
        },
      },
      locationRef: {
        type: "object",
        struct: {
          data_UUID0: {
            type: 'string',
            fieldMapping: 'locationTableId.data_UUID0',
          },
          data_UUID1: {
            type: 'string',
            fieldMapping: 'locationTableId.data_UUID1'
          },
          data_UUID2: {
            type: 'string',
            fieldMapping: 'locationTableId.data_UUID2'
          },
          data_UUID3: {
            type: 'string',
            fieldMapping: '@dictionaryTableId.data_UUID2'
          }
        }
      },
      dictionaryTableId: {
        type: "object",
        struct: {
          data_UUID0: {
            type: 'string',
            fieldMapping: 'dictionaryTableId.data_UUID0',
          },
          data_UUID1: {
            type: 'string',
            fieldMapping: 'dictionaryTableId.data_UUID1'
          },
          data_UUID2: {
            type: 'string',
            fieldMapping: 'dictionaryTableId.data_UUID2'
          },
        },
      },
    },
  },

  /** 与 system runtime context 的接口 */
  sysRtCxtInterface: {},

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
        body: [
          {
            id: 'controlId1',
            type: 'componentRef',
            componentID: 'comp_UUID1'
          },
          {
            id: 'controlId2',
            type: 'componentRef',
            componentID: 'comp_UUID2'
          },
          {
            id: 'controlId3',
            type: 'componentRef',
            componentID: 'comp_UUID3'
          },
          {
            id: 'controlId4',
            type: 'componentRef',
            componentID: 'comp_UUID4'
          },
          {
            id: 'controlId5',
            type: 'componentRef',
            componentID: 'comp_UUID5'
          },
          {
            id: 'controlId6',
            type: 'componentRef',
            componentID: 'comp_UUID6'
          },
          {
            id: 'controlId7',
            type: 'componentRef',
            componentID: 'comp_UUID7'
          },
          {
            id: 'controlId8',
            type: 'componentRef',
            componentID: 'comp_UUID8'
          },
        ],
      },
    ],
  },

  /** 组件集合 */
  componentsCollection: {
    comp_UUID1: {
      id: 'comp_UUID1',
      type: 'component',
      component: {
        type: 'Input',
        field: '@usetFromSu.data_UUID1',
        label: '用户名',
      },
      props: {},
      actions: {},
    },
    comp_UUID2: {
      id: 'comp_UUID2',
      type: 'component',
      component: {
        type: 'Input',
        field: '@usetFromSu.data_UUID2',
        label: '年龄'
      },
      props: {},
      actions: {
        // 同上simple-create-user
      },
    },
    comp_UUID3: {
      id: 'comp_UUID3',
      type: 'component',
      component: {
        type: 'Input',
        field: '@usetFromSu.data_UUID3',
        label: '所属部门'
      },
      props: {},
      actions: {
        onClick: {
          type: "actionRef",
          actionID: "selectDeparment",
        },
      },
    },
    comp_UUID4: {
      id: 'comp_UUID4',
      type: 'component',
      component: {
        type: 'Input',
        field: '@usetFromSu.data_UUID4',
        label: '所属部门建筑物',
      },
      props: {},
      actions: {},
    },
    comp_UUID5: {
      id: 'comp_UUID5',
      type: 'component',
      component: {
        type: 'Input',
        field: '@usetFromSu.data_UUID5',
        label: '所属部门楼层',
      },
      props: {},
      actions: {},
    },
    comp_UUID6: {
      id: 'comp_UUID6',
      type: 'component',
      component: {
        type: 'Input',
        field: '@usetFromSu.data_UUID6',
        label: '所属部门区域',
      },
      props: {},
      actions: {},
    },
    comp_UUID7: {
      id: 'comp_UUID7',
      type: 'component',
      component: {
        type: "Button",
        text: "提交",
      },
      props: {},
      actions: {
        onClick: {
          type: "actionRef",
          actionID: "actionId1",
        },
      },
    },
  },

  /** 动作集合 */
  actionsCollection: {
    actionId1: {
      // 同simple-create-user
      flowItems: {}
    },
    selectDeparment: {
      flowItems: {
        f1: {
          variable: "var1",
          expression: "@open(url, @PageOutput)",
        },
        f2: {
          variable: "var2",
          expression: "@transformShow(#var1)",
        },
      },
      flowCondition: {},
      // 检查页面输出的值。并赋值和转换成页面展示
      flowControl: `
        if (#f1) {
          #f2;
        }
      `,
    },
  },

  /** 关系集合 */
  // 更明确职能？
  relationshipsCollection: {
    dataChanged: {
      // 此处的结构？？？
      selectDeparmentID1: {
        broadcaster: {
          // 字段？ // 如果广播一个会有数据缺失，如果是多个那怎么办？
          '@usetFromSu.data_UUID3': {
            '@usetFromSu.data_UUID4': {
              field: '@usetFromSu.data_UUID4',
              when: ['onChange'],
              how: {
                type: "",
                actionID: "",
              },
            },
            // TODO: ???
            '@usetFromSu.data_UUID5': {
              field: '@usetFromSu.data_UUID5',
              when: ['onChange'],
              how: {
                type: "",
                actionID: "",
              },
            },
            '@usetFromSu.data_UUID6': {
              field: '@usetFromSu.data_UUID6',
              when: ['onChange'],
              how: {
                type: "",
                actionID: "",
              },
            },
          },
        },
        flowConditionCollection: {},
        targetFlowChain: {
          type: "",
          chain: ``,
        },
      },
    },
  },
};

export default CreteUser;
