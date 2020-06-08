import { TypeOfIUBDSL } from '../types';

export const CreateUserPage: TypeOfIUBDSL = {
  id: 'id',
  type: 'config',
  name: '用户管理',
  dataSourceRefID: 'dataSourceId1',
  // page interface，与其他 IUB-DSL 实例的输入输出接口
  interface: {
    // 这里可以参考 graphQL 的查询设计，https://graphql.org/
    output: {
      type: 'text',
      getStruct: {}
    },
    input: {
      type: 'struct',
      getStruct: {
        var1: 'string',
        var2: 'int',
        var3: {

        }
      }
    }
  },
  // 元数据映射集合
  metadataMapping: {
    mapping: {
      type: 'uuid2field',
      mapping: {
        componentBindField_UUID_1: 'username',
        componentBindField_UUID_2: 'department',
        componentBindField_UUID_3: 'age',
      }
    },
    dataSource: {
      dataSourceId1: {
        type: 'general',
        database: '-',
        tableName: 'User',
        columns: [
          {
            field: 'username',
            type: 'char',
            len: 32
          }
        ]
      }
    }
  },
  // 对应组件组的mapping
  relationshipsCollection: {
    // 数据关系
    dataPipeData: {
      subscribe: {
        id1: {
          // 注意互相订阅广播关系导致死循环
          // type: 'subscribe',
          // 数据字段变化订阅，例如 username 订阅 department 的变化
          subscriber: {
            componentBindField_UUID_1: [{
              target: 'componentBindField_UUID_2',
              trigger: {
                when: 'onFocus',
                how: {
                  type: 'actionRef',
                  actionID: 'subscriber-business-1'
                }
              },
            }, {
              target: 'componentBindField_UUID_3'
            }]
          }
        },
      },
      broadcast: {
        id2: {
          // type: 'broadcast',
          // 数据字段广播
          broadcaster: {
            componentBindField_UUID_3: [{
              target: 'department1',
              trigger: {
                when: 'onFocus',
                how: {
                  type: 'actionRef',
                  actionID: 'subscriber-business-2'
                }
              },
            }]
          }
        }
      }
    },
    componentPipeData: {
      id: {
        type: '',
        componentID: '',
        field: ''
      }
    }
  },
  componentsCollection: {
    22: {
      id: '22',
      // 实际控件，不具备布局功能，专注交互功能
      type: 'component',
      component: {
        // 控件类型，这里系统内置了足够的控件
        type: 'Input',
        // 对应数据库的 field
        field: 'componentBindField_UUID_1',
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
          type: 'direct',
          func: () => ({})
        },
        onUnmount: {
          type: 'direct',
          func: () => ({})
        },
        onClick: {
          type: 'actionRef',
          actionID: 'business-1'
        },
        onTap: {
          type: 'direct',
          func: () => ({})
        },
        onChange: {
          type: 'direct',
          func: () => ({})
        },
        onFocus: {
          type: 'direct',
          func: () => ({})
        },
      },
    },
  },
  actionsCollection: {
    'subscriber-business-1': async (context) => {
      // 通过表达式计算新值，返回将影响
      const newValue = 'expression';
      return newValue;
    },
    'subscriber-business-2': async (context) => {
      // 通过表达式计算新值，返回将影响
      const newValue = 'expression';
      return newValue;
    },
    'business-1': async (context) => {
      // 发送请求
      let a = maping(context.data);
      a = xhr(a);

      // 异步任务集合
      const step1 = new Promise();
      const step2 = new Promise();
      const step3 = new Promise();
      Promise.all([
        step1, step2, step3
      ]);

      // 同步任务集合
      await serviceA(a);
      await serviceB(a);
      await serviceC(a);

      // 表达式
      context.expression();
    },
    'business-submit2': (context) => {
      context.apiFetch({
        method: 'insert',
        tableName: 'User',
        params: {
          username: '123'
        }
      })
        .then((res) => {

        });
    },
    'business-submit': (context) => {
      context.submit(
        new Promise(async (transport) => {
          transport({
            method: 'insert',
            tableName: 'User',
            params: {
              username: 'xxx',
            }
          })
            .then((res) => {
              transport({
                method: 'insert',
                tableName: 'Department',
                params: {
                  name: 'xxx',
                  username: res.username
                }
              });
            });
        })
      );
      // 提交
      // context.submit([
      //   {
      //     method: 'insert',
      //     tableName: 'User',
      //     params: {
      //       username: 'xxx',
      //     }
      //   },
      //   {
      //     method: 'insert',
      //     tableName: 'Department',
      //     params: {
      //       name: 'xxx',
      //     }
      //   },
      // ]);
    }
  },
  layoutContent: {
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
            id: 'ref11',
            type: 'componentRef',
            componentID: '22'
          },
          {
            id: '33',
            type: 'component',
            component: {
              type: 'Input',
              field: 'age',
              required: false
            },
          },
          {
            id: '44',
            type: 'component',
            component: {
              type: 'TreeSelector',
              field: 'department',
              required: false,
              dataSource: {
                tableName: 'TreeTable'
              }
            },
          },
          {
            id: '44',
            type: 'component',
            component: {
              type: 'Table',
              onMountQuery: true,
              bindQueryBtn: '',
              columns: [{
                field: 'username',
                editable: true
              }],
              dataSource: {
                tableName: 'TreeTable'
              }
            },
          },
          {
            id: '66',
            type: 'component',
            component: {
              type: 'Button',
              text: '录入'
            },
            actions: {
              onClick: {
                type: 'actionRef',
                actionID: 'business-submit2'
              },
            },
            props: {

            }
          },
        ],
      }
    ]
  },
};