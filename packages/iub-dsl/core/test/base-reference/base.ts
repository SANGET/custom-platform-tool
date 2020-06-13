import { TypeOfIUBDSL } from "../../types";

export const BaseReference: TypeOfIUBDSL = {
  // baseInfo
  id: 'pageId',
  type: 'config',
  name: '基础参考',

  /**
   * 元数据映射集合
   */
  metadataCollection: {
    dataSource: {
      dataSourceId1: {
        type: 'general',
        database: '-',
        tableName: 'User',
        columns: {
          uuid1:{
            field: 'username',
            type: 'char',
            len: 32
          }
        }
      },
      dataSourceId2: {
        type: 'general',
        database: '-',
        tableName: 'Department',
        columns: {
          uuid2:{
            field: 'department',
            type: 'char',
            len: 32
          }
        }
      },
    },
    // TODO: 关系是否需要描述库？
    dataSourceRelation: {
      dataSourceId1: {
        type: 'tableRef',
        subTable: 'dataSourceId2'
      },
      dataSourceId2: {
        type: 'tableRef',
        parentTable: 'dataSourceId1'
      }
    },
  },
  /**
   * 布局信息 
   */
  layoutContent: {
    type: 'general', // 这个节点可以承载自定义页面，自定义页面是通过另一个在线 IDE 编辑生成
    content: [
      // content Item
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
            id: 'ref11',
            type: 'componentRef',
            componentID: '22'
          },
          {
            id: 'ref11',
            type: 'componentRef',
            componentID: '23'
          },
        ]
      }
    ]
  },
  /**
   * 组件集合
   * @description component：描述comp长什么样。actions：解析能够提供的所有动作。
   */
  componentsCollection: {
    compId: {
      id: '',
      type: 'component',
      component: {
        type: 'Button',
        text: '提交'
      },
      /** 存储通用 props 编辑后生成的数据 */
      props: {
        /** 支持部分通用样式 */
        style: {}
      },
      actions: {
        onClick: {
          type: 'actionRef',
          // TODO: 多动作的流程需要合并？应该是一个动作关系描述。而且这个动作关系不太复杂的关系
          actionID: ['b-1', 'b-2'], 
        }
      }
    }
  },
  /**
   * 动作集合
   * @description 需求：一个动作提交一次，一次提交一个事物
   * @description 可以引用单个f1或者#outputF1变量，但是不能引用整个b-1。 
   */
  actionsCollection: {
    'b-1': {
      flow: {
        // co
        f1: {
          variable: 'outputF1',
          expression: '@business1(@group1)'
        },
        f2: {
          variable: 'outputF2',
          expression: '@bussiness2(#temp1 + #outputF1 + @group1)'
        },
        f3: {
          variable: 'outputF3',
          expression: '@business3(#f4)'
        },
        f4: {
          variable: 'outputF4',
          expression: '@business4(#outputF3)'
        },
      },
      flowExpression: {
        fe1: {
          variable: 'var1',
          expression: `#{v1} > 10`,
        },
        fe2: {
          variable: 'var2',
          expression: `#{v1} < 10`,
        },
      },
      /** 简单场景：按钮 -> 发送查询条件的表单数据 -> 获取表格数据 */
      flowControl: `
        #f1;
        if(#var1) {
          #f2
        } else {
          #f4;
          #f3;
        }
      `,
    }, 
    'b-2': {
      flow: {
        f1: {
          variable: 'b-1',
          expression: `@handle(@A)`
        }
      }
    }
  },
  /**
   * 关系集合
   */
  relationshipsCollection: {
    dataChanged: {
      relationId1: {
        broadcaster: {
          UUIDA: {
            tb: {
              field: 'UUIDB',
              when: ['onUserChange', 'onMount', 'onChange'],
              how: {
                type: '',
                actionID: 'a1'
              }
            },
          },
        },
        targetFlowChain: {
          type: '',
          chain: `
            #a1;
            pipe(
              exp_B(#a2, #c1),
              exp_D(
                $0,
                #c2
              ),
              exp_E(
                $1,
                #c3
              )
            ), 
          `,
        },
        flowConditionCollection: {
          exp_B: {
            type: '',
            handler: '',
          },
          exp_D: { type: '' },
          exp_E: { type: '' },
        }
      }
    },
    runAction: {},
  },
  /**
   * 1. 与 system runtime context 的接口
   * 2. 约定页面的输入输出数据
   */
  sysRtCxtInterface: {
    // 将内部的变量导出到 system runtime context
    exposeVar: {
      componentBindField_UUID_1: 'var1'
    },
    // 引用其他页面的
    refVar: {
      pageUuid1: `#{pageID}.componentBindField_UUID_1`,
      pageUuid2: `#{pageID}.componentBindField_UUID_2`,
    },
    // 这里可以参考 graphQL 的查询设计，https://graphql.org/
    // TODO: 多个、单个？不同情况输入/输出不同的数据结构。？
    output: {
      type: 'text',
      struct: {}
    },
    input: {
      type: 'struct',
      struct: {
        var1: 'string',
      }
    }
  },
  schemas: {
    page: {
      expresstionVar1: 'string',
      expresstionVar2: {
       type: 'array',
       struct: {
         username: '@expresstionVar1',
         age: 'num',
       } 
      }
    },
    flow: {
      group1: {
        type: 'object',
        struct: {
          name: 'string',
          age: 'num',
        } 
      }
    },
  }
}