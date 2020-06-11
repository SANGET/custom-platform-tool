const globalCollections = {
  modifierCollection: {
    '##': 'required',
  },
  eventCollection: {
    'API': {
      query: () => {
        return ['data']
      }
    }
  }
}

const listTableIUBDSL = {
  id: 'pageId',
  type: 'config',
  name: '用户管理',
  // 理论上这一层应该在顶可以复用
  metaDataMapping: {
    'tableId1': {
      // TODO: 不同类型能否也遵循这种规范
      type: 'table', // source,SQL,ES
      field: {
        uuid1: 'username',
        uuid2: 'age',
        uuid3: 'description',
        uuid4: 'fid',
      },
      subRelationShip: {
        // 因为数据表之间的链接关系只要一个就足够了
        tableId2: {
          connectFiled: 'self uuid4 to uuid1',
          relaction: '一对多',
          // ... outherRelation // 可能有条件关系等
        }
      }
    },
    'tableId2': {
      type: 'table',
      field: {
        uuid1: 'id',
        uuid2: 'duty',
        uuid3: 'workingStartTime',
        uuid4: 'workingEndTime',
      },
      // 这个好像重复引用会不会有问题
      parentRelationShip: {
        tableId1: {
          connectFiled: 'self uuid1 to uuid4',
          relaction: '多对一',
          // ... outherRelation // 可能有条件关系等
        }
      }
    },
    'tabeId3': {
      type: 'table',
      filed: {
        uuid1: 'id',
        uuid2: 'hobby',
      },
      parentRelationShip: {
        tableId1: {
          connectFiled: 'self uuid1 to uuid4',
          relation: '一对一',
        }
      }
    }
  },
  // 是否也可以是页面变量
  /** 1 */
  dataSourceMappingCollections: {
    'collection1_query': {
      name: '',
      id: '',
      type: 'object', // array
      field: {
        // 这里有key
        a: 'tableId1.uuid1',
        b: {
          source: 'tableId2.uuid1',
          alias: 'string',
        }
      }
    }
  },
  contentInformation: {
    type: 'general', // 这个节点可以承载自定义页面，自定义页面是通过另一个在线 IDE 编辑生成
    child: [
      {
        id: '1',
        type: 'container', // 布局容器
        layout: {
          type: 'flex', // 布局方式
          props: {
            justifyContent: 'start',
            justifyItems: 'start'
          }
        },
        body: [
          {
            id: '',
            type: 'treeContorl',
            // ... 控件单独需要的属性
          },
          // {
          //   id: 'ref11',
          //   type: 'componentRef',
          //   componentID: '22'
          // },
          {
            id: '',
            type: 'tableControl',
            // 想清楚啊
            solt: {
              $search$: [
                {
                  id: 'input',

                }
              ],
              $btn$: [
                {
                  id: 'btn1',
                }
              ]
            },
            props: {

            }
          }
        ],
      }
    ]
  },
  componentsCollections: {
    // ?
    componentId: {
      id: '',
      // type: 'HYButton',
      type: 'component', // 实际控件，不具备布局功能，专注交互功能
      uiRefID: '', // ui隔离层的id
      relationShip: {
        
      },
      /**
       * 1. 配置条件
       * 2. 配置系统内置事件/动作
       * 3. 配置一个表达式
       * 4. 配置数据引用关系
       * 5. 配置接入自定义事件
       * 6. 
       */
      actions: {
        onClick: {
          expression: 'string',
          input: {
            $1: 'groupId.uuid/controlId',
          },
          output: {
            $1: 'groupId.uuid/controlId',
          },
          // eventCode
          useEvent: {
            'ECode1': 'eventCollection.API.query',
            'ECode2': (context ,inputParamRef, outputParamRef) => {

            }
          },
          useRelationship: {

          },
          outputEffect: {
            // 回填数据？还是其他逻辑？
          }
        }
      }
    }
  },
  a: {
    // 多个流程都在一个容器内运行！！～～
    // 主流程、子流程
    flowId: [
      {
        step: '1',
        expressionId: '',
        condition: '',
        input: {},
        output: {},
        next: {
          step: '2',
          condition: '',
          input: {},
          output: {},
          next: []
        }
      }
    ],
    container: {
      // 定位、集合、引用
      // fail
      useSource: [
        // 集合  // 视为整体1？
        'collection1_query',
        'collection1_query.a',
        {
          use: 'collection1_query',
          inculdes: ['filed1', 'filed2'],
          exculdes: ['filed3'] // or
        }
        // 整体？
      ],
      
      // thinking ---- 
      useTempVariable: [
        'temp1', 'temp2'
      ],
      // useVariable
      query_1: {
        // 这个好像引用会有问题  // fail
        $$var$$: ['...collection1_query'],

        $key1$: 'collection1_query.a',
        $key2$: 'collection1_query.b',
      },
      table_1: {
        // 系统默认变量
        $$type$$: 'array',

        $key1$: 'collection1_query.a',
        $key2$: 'collection1_query.b',
      }
    },
    expressionCollection: {
      'expression1': {
        expression: '',
        // input: [{
        //   // 定位源？
        //   // 1. dataSource
        //   // 2. 流程变量？
        //   // 输入、输出的代理？
        //   // 1. key: value (key(uuid);value是引用到仓库的地址)
        //   // 2. key: tempValue
        //   //  key是真实的key、value是引用？
        // }, ['$[v1]','$[v2]'], '$[v3]'],
        // output: [{}]
      }
    }
  },
  actionsCollection: {
    'business-1': {
      expression: '',
      input: {
        $1: 'groupId.uuid/controlId',
      },
      output: {
        $1: 'groupId.uuid/controlId',
      },
      // eventCode
      useEvent: {
        'ECode1': 'eventCollection.API.query',
        'ECode2': (context ,inputParamRef, outputParamRef) => {

        }
      },
      useRelationship: {

      },
      outputEffect: {
        // 回填数据？还是其他逻辑？
      }
    }
  }
}