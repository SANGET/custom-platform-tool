/* eslint-disable @typescript-eslint/camelcase */

import { TypeOfIUBDSL } from "../types";

export const CreateUserPage: TypeOfIUBDSL = {
  id: "pageID",
  type: "config",
  name: "用户管理",
  dataSourceRef: {
    type: "tableRef",
    ref: {
      dataSourceId1: {
        subTable: "dataSourceId2",
      },
    },
  },
  /**
   * 1. 与 system runtime context 的接口
   * 2. 约定页面的输入输出数据
   */
  sysRtCxtInterface: {
    // 将内部的变量导出到 system runtime context
    exposeVar: {
      componentBindField_UUID_1: "var1",
    },
    // 引用其他页面的
    refVar: [
      `#{pageID}.componentBindField_UUID_1`,
      `#{pageID}.componentBindField_UUID_2`,
    ],
    // 这里可以参考 graphQL 的查询设计，https://graphql.org/
    output: {
      type: "text",
      getStruct: {},
    },
    input: {
      type: "struct",
      getStruct: {
        var1: "string",
        var2: "int",
        var3: {},
      },
    },
  },
  /**
   * 元数据映射集合
   */
  metadataMapping: {
    mapping: {
      type: "uuid2field",
      mapping: {
        componentBindField_UUID_1: "username",
        componentBindField_UUID_2: "department",
        componentBindField_UUID_3: "age",
      },
    },
    dataSource: {
      dataSourceId1: {
        type: "general",
        database: "-",
        tableName: "User",
        columns: [
          {
            field: "username",
            type: "char",
            len: 32,
          },
        ],
      },
      dataSourceId2: {
        type: "general",
        database: "-",
        tableName: "Department",
        columns: [
          {
            field: "name",
            type: "char",
            len: 32,
          },
        ],
      },
    },
  },
  // 对应组件组的mapping
  relationshipsCollection: {
    // 数据关系
    dataPipeData: {
      subscribe: {
        // 数据字段变化订阅，例如 username 订阅 department 的变化
        componentBindField_UUID_1: [
          {
            target: "componentBindField_UUID_2",
            trigger: {
              when: "onChange",
              how: {
                type: "actionRef",
                actionID: "b-1",
              },
            },
          },
          {
            target: "componentBindField_UUID_3",
          },
          {
            target: ["componentBindField_UUID_2", "componentBindField_UUID_3"],
          },
        ],
      },
      publish: {
        ASubcribe: {
          target: ["B", "C"],
          condintion: "",
        },
      },
      broadcast: {
        // type: 'broadcast',
        // 数据字段广播
        componentBindField_UUID_3: [
          {
            target: "department1",
            trigger: {
              when: "onFocus",
              how: {
                type: "actionRef",
                actionID: "b-2",
              },
            },
          },
          {
            target: "department2",
            trigger: {
              when: "onFocus",
              how: {
                type: "actionRef",
                actionID: "b-3",
              },
            },
          },
        ],
      },
    },
    componentPipeData: {
      id: {
        type: "",
        componentID: "",
        field: "",
      },
    },
  },
  componentsCollection: {
    cId1: {
      id: "22",
      // 实际控件，不具备布局功能，专注交互功能
      type: "component",
      component: {
        // 控件类型，这里系统内置了足够的控件
        type: "Input",
        // 对应数据库的 field
        field: "componentBindField_UUID_1",
        required: true,
      },
      /**
       * 承载所有动作，所有的动作都可以通过 [动作] 来描述操作
       *
       * 格式为 [事件 event]: [动作 action]
       *
       * 动作：动作的回调参数中有当前页面的「上下文状态」，用于在运行时获取页面信息，包括一切需要的信息
       */
      actions: {
        onMount: {
          type: "direct",
          func: () => ({}),
        },
        onUnmount: {
          type: "direct",
          func: () => ({}),
        },
        onClick: {
          type: "actionRef",
          actionID: "b-submit-1",
        },
        onTap: {
          type: "direct",
          func: () => ({}),
        },
        onChange: {
          type: "direct",
          func: () => ({}),
        },
        onFocus: {
          type: "direct",
          func: () => ({}),
        },
      },
    },
    cId2: {
      type: "component",
      component: {
        type: "Button",
        text: "提交",
      },
      actions: {
        onClick: {
          type: "actionRef",
          actionID: "b-submit-1",
        },
      },
    },
  },
  // 流程运行时上下文的 Schema
  flowSchemas: {
    '#group1.a': {
      type: 'array',
      struct: {
        username: "string",
        age: "num",
      },
    },
    "#group1.b": {
      type: "array",
      struct: {
        username: `#group1.a`,
        age: "num",
      },
    },
    temp1: {
      type: "array",
      filed: {
        username: "string",
        age: "num",
      },
    },
    temp2: {
      type: "array",
      filed: {
        username: "string",
        age: "num",
      },
    },
    group1: {
      method: "insert",
      tableName: "dataSourceId1",
      params: [
        {
          type: "",
          field: "componentBindField_UUID_1",
          filter: () => {},
          trace: true,
        },
      ],
    },
    group2: {
      username: "",
      age: "",
    },
    group3: {
      data: [],
      pageIdx: 1,
    },
    group4: {},
    rule1: {},
  },
  actionsCollection: {
    "b-3": {
      flow: {
        f1: {
          // frc => flow runtime context
          variable: "#group1.a",
          expression: `@insert(@group1)`, // int [] {}
        },
        f2: {
          variable: "#temp1",
          expression: `@fetch(#group1.a)`,
        },
        f3: {
          variable: "#temp1",
          expression: `@fetch(#temp1)`,
        },
      },
    },
    "b-submit-1": {
      flow: {
        f1: {
          id: "f1",
          variable: "click",
          // expression: {
          //   type: 'func',
          //   handler: (context) => {
          //     context.submit({
          //       method: 'insert',
          //       tableName: 'User',
          //       params: {

          //       }
          //     });
          //   }
          // },
          code: `
            #group1.a = @fetch(@group1)
            #temp1 = @fetch(#group1.a)
            #temp2 = @filter(#temp1, @group2)
            #group2 = @fetch(#temp2) // 表格数据
            #group3 = @filter(#group2, @rule1) // 过滤表格数据
          `,
          output: ["group1.a", "group2", "group3"], // 流程数据仓库中改了什么值
        },
        f2: {
          id: "f1",
          variable: "click",
          code: `
            #temp = filter(@group1)
            #group2 = map(#temp)
            #group3 = #temp
          `,
        },
        f3: {
          id: "f1",
          variable: "click",
          code: `
            mark(@group2, @group3)
          `,
        },
      },
      flowControl: {
        expression: ``,
      },
    },
    "b-1": {
      flow: {
        // 没有 api 数据请求
        f1: {
          id: "f1",
          variable: "v1",
          expression: ``,
        },
        f2: {
          // api 数据请求
          id: "f2",
          variable: "v2",
          // inout: ['temp1', 'group1', '...'],
          // 模拟 insert 数据
          expression: `
            let a = @fetch(@group1); // {}
            let b = @fetch(@group1); // string
            let c = @fetch(@group1); // int
            #group2.a = a
            #group2.b = b
            #group2.c = c
            #group3 = #fetch(#group2); // []
            #group4 = #fetch(#group1); // int
            @fetch(#group4)
          `,
          // output : ['temp1', 'group1', 'group2', 'group3'], // 改变了group1
          fail: "",
        },
        f3: {
          id: "f3",
          // input: ['temp1', 'group2', 'group3']
          variable: "v3",
          expression: ``,
        },
        f4: {
          id: "f4",
          variable: "v4",
          expression: `#{v1} + #{v2}`,
        },
      },
      flowExpression: {
        fe1: {
          variable: "var1",
          expression: `#{v1} > 10`,
        },
        fe2: {
          expression: `#{v1} < 10`,
        },
      },
      flowControl: "if(!{fe1()}) { #{f1()} } else { f3(f4()) }",
    },
  },
  layoutContent: {
    type: "general", // 这个节点可以承载自定义页面，自定义页面是通过另一个在线 IDE 编辑生成
    child: [
      {
        id: "1",
        type: "container", // 布局容器
        layout: {
          type: "flex", // 布局方式
          props: {
            justifyContent: "start",
            justifyItems: "start",
          },
        },
        body: [
          {
            id: "ref11",
            type: "componentRef",
            componentID: "22",
          },
          {
            id: "33",
            type: "component",
            component: {
              type: "Input",
              field: "age",
              required: false,
            },
          },
          {
            id: "44",
            type: "component",
            component: {
              type: "TreeSelector",
              field: "department",
              required: false,
              dataSource: {
                tableName: "TreeTable",
              },
            },
          },
          {
            id: "44",
            type: "component",
            component: {
              type: "Table",
              onMountQuery: true,
              bindQueryBtn: "",
              columns: [
                {
                  field: "username",
                  editable: true,
                },
              ],
              dataSource: {
                tableName: "TreeTable",
              },
            },
          },
          {
            id: "66",
            type: "component",
            component: {
              type: "Button",
              text: "录入",
            },
            actions: {
              onClick: {
                type: "actionRef",
                actionID: "business-submit2",
              },
            },
            props: {},
          },
        ],
      },
    ],
  },
};
