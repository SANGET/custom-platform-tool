const globalCollections = {
  modifierCollection: {
    "##": "required",
  },
  eventCollection: {
    API: {
      query: () => {
        return ["data"];
      },
      query2: {
        async: true,
        handler: () => {
          return ["data"];
        },
        success: () => {},
        fail: () => {},
      },
      feachTable: {
        async: true,
        handler: () => {
          return ["data"];
        },
        success: () => {},
        fail: () => {},
      },
    },
  },
};

const listTableIUBDSL = {
  id: "pageId",
  type: "config",
  name: "用户管理",
  // 理论上这一层应该在顶可以复用
  // 元数据映射
  metaDataMapping: {
    tableId1: {
      // TODO: 不同类型能否也遵循这种规范
      type: "table", // source,SQL,ES
      field: {
        uuid1: "username",
        uuid2: "age",
        uuid3: "description",
        uuid4: "fid",
      },
      subRelationShip: {
        // 因为数据表之间的链接关系只要一个就足够了
        tableId2: {
          connectFiled: "self uuid4 to uuid1",
          relaction: "一对多",
          // ... outherRelation // 可能有条件关系等
        },
      },
    },
    tableId2: {
      type: "table",
      field: {
        uuid1: "id",
        uuid2: "duty",
        uuid3: "workingStartTime",
        uuid4: "workingEndTime",
      },
      // 这个好像重复引用会不会有问题
      parentRelationShip: {
        tableId1: {
          connectFiled: "self uuid1 to uuid4",
          relaction: "多对一",
          // ... outherRelation // 可能有条件关系等
        },
      },
    },
    tabeId3: {
      type: "table",
      filed: {
        uuid1: "id",
        uuid2: "hobby",
      },
      parentRelationShip: {
        tableId1: {
          connectFiled: "self uuid1 to uuid4",
          relation: "一对一",
        },
      },
    },
  },
  // 是否也可以是页面变量
  /** 1 */
  // 通过元数据映射，生成一个store一样的仓库映射。
  // 你实际请求的时候，对应后台
  dataSourceMappingCollections: {
    collection1_query: {
      name: "",
      id: "",
      type: "object", // array
      field: {
        // 这里有key ,, 是否这样生成。
        a: "tableId1.uuid1",
        b: {
          source: "tableId2.uuid1",
          alias: "string",
        },
      },
    },
  },
  contentInformation: {
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
            id: "",
            type: "treeContorl",
            // ... 控件单独需要的属性
          },
          // {
          //   id: 'ref11',
          //   type: 'componentRef',
          //   componentID: '22'
          // },
          {
            id: "",
            type: "tableControl",
            // 想清楚啊
            solt: {
              $search$: [
                {
                  id: "input",
                },
              ],
              $btn$: [
                {
                  id: "btn1",
                },
              ],
            },
            props: {},
          },
        ],
      },
    ],
  },
  componentsCollections: {
    // ?
    componentId: {
      id: "",
      // type: 'HYButton',
      type: "component", // 实际控件，不具备布局功能，专注交互功能
      uiRefID: "", // ui隔离层的id
      relationShip: {},
      /**
       * 1. 配置条件
       * 2. 配置系统内置事件/动作
       * 3. 配置一个表达式
       * 4. 配置数据引用关系
       * 5. 配置接入自定义事件
       * 6.
       */
      actions: {
        onClick: "business-flow-1",
      },
    },
  },
  actionsCollection: {
    "business-flow-1": {
      // contextRef: {},
      containerRef: {
        useTempVariable: ["temp1", "temp2", "temp3"],
        // useVariable
        query_1: {
          // 这个好像引用会有问题  // fail
          // $$var$$: ['...collection1_query'],

          $key1$: "collection1_query.a",
          $key2$: "collection1_query.b",
        },
        query_2: {
          $key1$: "collection1_query.a",
          $key2$: "collection1_query.b",
        },
        table_1: {
          // 系统默认变量
          $$type$$: "array",

          $key1$: "collection1_query.a",
          $key2$: "collection1_query.b",
        },
      },
      flowing: [
        {
          step: "0",
          expression: "var temp1 = 10",
          condition: "query_1 !== undefined && query_2 !== undefined",
          next: [
            {
              step: "1",
              condition: "temp1 > 10",
              expression: "expression_id1",
              next: {
                step: "2",
                condition: "",
                expression: "expression_id3",
              },
            },
            {
              step: "1",
              condition: "temp1 <= 10",
              expression: "expression_id2",
              next: {
                step: "2",
                condition: "",
                expression: "expression_id3",
              },
            },
          ],
        },
      ],
      expressionCollection: {
        expression_id1: {
          expression: `
            var T1 = A(query_1.$$key1$$);
            query_1.$$key1$$ = T1;
            query_2.$$key1$$ = T1 + query_1.$$key2$$;
            var temp2 = T1 * query_1.$$key2$$;
          `,
          useEvent: {
            A: "eventCollection.API.query()",
          },
          input: ["query_1", "query_2.$$key1$$"],
          output: ["temp2", "query_1", "query_2.$$key1$$"], // 输出和改变的值
        },
        expression_id2: {
          // 有三个、handler、success、fail
          expression: `
            var T1 = A(query_2);
            query_1.$key1$ = T1.$key1$;
            query_1.$key2$ = T1.$key2$;
            var temp3 = (T1.$key1$ + query_1.$$key2$$) * T1.$key2$
          `,
          useEvent: {
            A: "eventCollection.API.query2",
          },
          input: ["query_2", "query_1.$$key2$$"],
          output: ["temp3", "query_1"], // 输出和改变的值
        },
        expression_id3: {
          expression: `
            table_1 = A(query_1, param1)
          `,
          input: [
            "query_1",
            {
              alias: "param1",
              source: ["temp2", "temp3"],
            },
          ],
          output: ["table_1"],
        },
      },
    },
  },
  // 多个流程都在一个容器内运行！！～～
  // 主流程、子流程
};
