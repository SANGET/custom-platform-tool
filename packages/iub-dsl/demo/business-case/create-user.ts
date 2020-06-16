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
          tableUUID0: {
            field: "id",
            type: "string",
            len: 32,
          },
          tableUUID1: {
            field: "username",
            type: "string",
            len: 32,
          },
          tableUUID2: {
            field: "age",
            type: "int",
            len: 3,
          },
          tableUUID3: {
            field: "deparmentId",
            type: "string",
            len: 32,
          },
        },
      },
      deparmentTableId: {
        type: "general",
        database: "-",
        tableName: "deparment",
        columns: {
          tableUUID0: {
            field: "id",
            type: "string",
            len: 32,
          },
          tableUUID1: {
            field: "deparmentname",
            type: "string",
            len: 32,
          },
          tableUUID2: {
            field: "pid",
            type: "string",
            len: 32,
          },
          tableUUID3: {
            field: "locationId",
            type: "string",
            len: 32,
          },
        },
      },
      locationTableId: {
        type: "general",
        database: "-",
        tableName: "location",
        columns: {
          tableUUID0: {
            field: "id",
            type: "string",
            len: 32,
          },
          tableUUID1: {
            field: "locationname",
            type: "string",
            len: 32,
          },
          tableUUID2: {
            field: "pid",
            type: "string",
            len: 32,
          },
          tableUUID3: {
            field: "type",
            type: "string",
            len: 2,
          },
        },
      },
      dictionaryTableId: {
        type: "general",
        database: "-",
        tableName: "dictionary",
        columns: {
          tableUUID0: {
            field: "id",
            type: "string",
            len: 32,
          },
          tableUUID1: {
            field: "dictionaryName",
            type: "string",
            len: 6,
          },
          tableUUID2: {
            field: "dictionaryType",
            type: "string",
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
          // tableUUID3: 'deparmentTableId.tableUUID0'
          tableUUID3: {
            // ??
            connectKey: "deparmentTableId.tableUUID0", // 链接key
            key: "deparmentTableId.tableUUID0", // 存储值
            value: "deparmentTableId.tableUUID1", // 显示值
          },
        },
      },
      deparmentTableId: {
        type: "tableRef",
        parentTable: {
          tableUUID2: {
            connectKey: "deparmentTableId.tableUUID0", // 链接key
            key: "deparmentTableId.tableUUID0", // 存储值
            value: "deparmentTableId.tableUUID1", // 显示值
          },
        },
        quoteRef: {
          tableUUID3: {
            connectKey: "locationTableId.tableUUID0", //
            key: "locationTableId.tableUUID0",
            value: "locationTableId.tableUUID1",
          },
        },
      },
      locationTableId: {
        type: "tableRef",
        parentTable: {
          tableUUID2: {
            connectKey: "locationTableId.tableUUID0", // 链接key
            key: "locationTableId.tableUUID0", // 存储值
            value: "locationTableId.tableUUID1", // 显示值
          },
        },
        quoteRef: {
          tableUUID3: {
            connectKey: "dictionaryTableId.tableUUID2", //
            key: "dictionaryTableId.tableUUID0",
            value: "dictionaryTableId.tableUUID1",
          },
        },
      },
    },
  },

  /** 数据模型 */
  // TODO: 引用table和schemas的差别
  schemas: {
    flow: {},
    page: {
      userFromSu: {
        type: "object",
        struct: {
          dataUUID1: {
            // 用户名
            type: "string",
            mapping: "userTableId.tableUUID1",
          },
          dataUUID2: {
            // 年龄
            type: "num",
            mapping: "userTableId.tableUUID2",
          },
          dataUUID3: {
            // 所属部门
            type: "string",
            mapping: "@deparmentRef.dataUUID0",
          },
          dataUUID4: {
            // 建筑物
            type: "string",
            mapping: "@locationRef.dataUUID0",
          },
          dataUUID5: {
            // 楼层
            type: "string",
            mapping: "@locationRef.dataUUID0",
          },
          dataUUID6: {
            // 区域
            type: "string",
            mapping: "@locationRef.dataUUID0",
          },
        },
      },
      userFrom: {
        type: "object",
        struct: {
          dataUUID1: {
            type: "string",
            mapping: "userTableId.tableUUID1",
          },
          dataUUID2: {
            type: "num",
            mapping: "userTableId.tableUUID2",
          },
          dataUUID3: {
            type: "string",
            mapping: "@deparmentRef.dataUUID0",
          },
          // 是否需要引入？？成组
        },
      },
      deparmentRef: {
        type: "object",
        struct: {
          dataUUID0: {
            type: "string",
            mapping: "deparmentTableId.tableUUID0",
          },
          dataUUID1: {
            type: "string",
            mapping: "deparmentTableId.tableUUID1",
          },
          // TODO: 子父的？
          dataUUID2: {
            type: "string",
            mapping: "deparmentTableId.tableUUID2",
          },
          // TODO: 显示
          dataUUID3: {
            type: "string",
            mapping: "@locationRef.dataUUID0",
          },
        },
      },
      locationRef: {
        type: "object",
        struct: {
          dataUUID0: {
            type: "string",
            mapping: "locationTableId.tableUUID0",
          },
          dataUUID1: {
            type: "string",
            mapping: "locationTableId.tableUUID1",
          },
          dataUUID2: {
            type: "string",
            mapping: "locationTableId.tableUUID2",
          },
          dataUUID3: {
            type: "string",
            mapping: "@dictionaryTableId.dataUUID2",
          },
        },
      },
      dictionaryTableId: {
        type: "object",
        struct: {
          dataUUID0: {
            type: "string",
            mapping: "dictionaryTableId.tableUUID0",
          },
          dataUUID1: {
            type: "string",
            mapping: "dictionaryTableId.tableUUID1",
          },
          dataUUID2: {
            type: "string",
            mapping: "dictionaryTableId.tableUUID2",
          },
        },
      },
    },
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
          {
            id: "controlId4",
            type: "componentRef",
            componentID: "compUUID4",
          },
          {
            id: "controlId5",
            type: "componentRef",
            componentID: "compUUID5",
          },
          {
            id: "controlId6",
            type: "componentRef",
            componentID: "compUUID6",
          },
          {
            id: "controlId7",
            type: "componentRef",
            componentID: "compUUID7",
          },
          {
            id: "controlId8",
            type: "componentRef",
            componentID: "compUUID8",
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
        type: "Input",
        field: "@usetFromSu.dataUUID1",
        label: "用户名",
      },
      props: {},
      actions: {},
    },
    compUUID2: {
      id: "compUUID2",
      type: "component",
      component: {
        type: "Input",
        field: "@usetFromSu.dataUUID2",
        label: "年龄",
      },
      props: {},
      actions: {
        // 同上simple-create-user
      },
    },
    compUUID3: {
      id: "compUUID3",
      type: "component",
      component: {
        type: "Input",
        field: "@usetFromSu.dataUUID3",
        label: "所属部门",
      },
      props: {},
      actions: {
        onClick: {
          type: "actionRef",
          actionID: "selectDeparment",
        },
      },
    },
    compUUID4: {
      id: "compUUID4",
      type: "component",
      component: {
        type: "Input",
        field: "@usetFromSu.dataUUID4",
        label: "所属部门建筑物",
      },
      props: {},
      actions: {},
    },
    compUUID5: {
      id: "compUUID5",
      type: "component",
      component: {
        type: "Input",
        field: "@usetFromSu.dataUUID5",
        label: "所属部门楼层",
      },
      props: {},
      actions: {},
    },
    compUUID6: {
      id: "compUUID6",
      type: "component",
      component: {
        type: "Input",
        field: "@usetFromSu.dataUUID6",
        label: "所属部门区域",
      },
      props: {},
      actions: {},
    },
    compUUID7: {
      id: "compUUID7",
      type: "component",
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
      flow: {},
    },
    selectDeparment: {
      flow: {
        f1: {
          variable: "var1",
          expression: "@open(url, @PageOutput)",
        },
        f2: {
          variable: "var2",
          expression: "@transformShow(#var1)",
        },
      },
      flowExpression: {},
      // 检查页面输出的值。并赋值和转换成页面展示
      flowControl: `
        if (#f1) {
          #f2;
        }
      `,
    },
  },

  /** 关系集合 */
  relationshipsCollection: {
    dataChanged: {
      // 此处的结构？？？
      selectDeparmentID1: {
        broadcaster: {
          // 字段？ // 如果广播一个会有数据缺失，如果是多个那怎么办？
          "@usetFromSu.dataUUID3": {
            "@usetFromSu.dataUUID4": {
              field: "@usetFromSu.dataUUID4",
              when: ["onChange"],
              how: {
                type: "",
                actionID: "",
              },
            },
            // TODO: ???
            "@usetFromSu.dataUUID5": {
              field: "@usetFromSu.dataUUID5",
              when: ["onChange"],
              how: {
                type: "",
                actionID: "",
              },
            },
            "@usetFromSu.dataUUID6": {
              field: "@usetFromSu.dataUUID6",
              when: ["onChange"],
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
