// TODO: 内外通讯
const relation = {
  // namespance: '',
  // 元数据映射
  storeHub: [
    { // 对标直接的数据
      type: 'general', // metadata
      // 唯一
      dataSourceName: 'table.User', // 表、引擎、接口、自定义数据、sql、字典
      sourceRelation: '', // 表与表直接的关系
      field: {
        username: String, // 1
        age: {  // 2
          type: Number,
          // 真实数据的出入口。
          getter(basicVal) {
            if (basicVal < 10) {
              return basicVal
            } else {r
              return 1
            }
          },
          setter: {
            // 关联关系的输入、保证入库数据（货币、加密）
            useRelation: [],
          }
        },
      }
    }
  ],
  // 对应组件和元数据映射
  dataSourceHub: [
    {
      // submitFrom、queryFrom
      type: 'formData', // formData、showData
      defaultStore: 'table.User', // 默认引用的表
      defaultSettingRelation: [],
      field: {
        name: 'username', // 与源表的对应
        age: {
          sorceFiled: 'age',
          setRelation: [],
          getRelation: [],
          publishRelation: [],
          subscribeRelation: [],
          vaildRelation: [],
          // 整体状态是由上级传入。 本页面的应该由规则或者用户描述的。
          statusRelation: [] // 针对页面 // TODO
        },
        money: {
          sorceFiled: {
            store: '',
            field: '',
          }
        }
      }
    },
    {
      type: 'showData',
      defaultStore: 'table.User', // 默认引用的表
      defaultSettingRelation: [],
      field: {
        name: 'username',
        age: {
          sorceFiled: 'age',
          filerRelation: [],
          // getRelation: []
        }
      }
    }
  ],
  // 全局的数据关系。
  dataRelationHub: [],

}


const globalCollection = {
  modifierCollection: {
    '##': 'required',
  }
}

const R = {
  metaDataMapping: {
    'tableId': {
      type: 'table', // source,SQL,ES
      field: {
        // username: 'uuid1',
        uuid1: 'username', // 推荐
      }
    }
  },
  // 是否也可以是页面变量
  /** 1 */
  dataSourceMapping: {
    // 如果考虑成组
    'groupId': {
      // 'defaultMappingInfo': {
        // tableId: 'tableId',
      // },
      // TODO: 控件id还是uuid？
      'controlId': {
        tableId: 'tableId',
        filed: 'uuid1'
      },
    },
    // 关系呢？
    customizeVariable: {
      'var1': {
        id: 'uuid',
        description: '描述信息',
        type: Number,
        code: 'xingbei',
        /** 2 */
        expressionRelationShip: {
          expression: 'string',
          input: {
            $1: 'groupId.uuid/controlId',
          }, 
          // eventCode
          useEvent: {
            'code': 'eventRef',
          },
          useRelationship: {

          },
          output: {
            $1: 'groupId.uuid/controlId',
          },
          outputEffect: {

          }
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
            id: 'ref11',
            type: 'componentRef',
            componentID: '22'
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
                actionID: 'business-submit'
              },
            },
            props: {

            }
          },
        ],
      }
    ]
  },
  componentCollection: {
    'componentId': {
      id: 'componentId',
      type: 'component', // 实际控件，不具备布局功能，专注交互功能
      uiRefID: '', // ui隔离层的id
      lifecycle: {

      },
      relationShip: {
        
      },
      /**
       * 承载所有动作，所有的动作都可以通过 [动作] 来描述操作
       *
       * 格式为 [事件 event]: [动作 action]
       *
       * 动作：动作的回调参数中有当前页面的「上下文状态」，用于在运行时获取页面信息，包括一切需要的信息
       */
      actionsCollection: {
        
      }
    }
  }
}