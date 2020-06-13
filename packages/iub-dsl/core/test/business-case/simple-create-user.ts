import { TypeOfIUBDSL } from "../../types";

const SimpleCreateUser: TypeOfIUBDSL = {
  id: 'SimpleCreateUser',
  type: 'config',
  name: 'SimpleCreateUser',

  /** 元数据映射集合 [数据源关系枢纽] */
  metadataCollection: {
    dataSource: {
      userTableId: {
        type: 'general',
        database: '-',
        tableName: 'user',
        columns: {
          dataUUID1: {
            field: 'username',
            type: 'string',
            len: 32
          },
          dataUUID2: {
            field: 'age',
            type: 'int',
            len: 3
          }
        }
      }
    },
  },

  /** 系统上下文接口 */
  sysRtCxtInterface: {
    exposeVar: {
      // 输出key，接受key
      pageContextUUID1: 'var1'
    },
    refVar: {
      pageContextUUID2: 'pageID.pageContextUUIDX'
    },
    output: {
      type: '',
      struct: {
        pageContextUUID3: 'string'
      }
    },
    input: {
      type: '',
      struct: {
        pageContextUUID4: 'string'
      }
    }
  },

  /** 数据模型 */
  schemas: {
    page: {},
    flow: {}
  },

  /** 布局信息 */
  layoutContent: {
    type: 'general',
    content: [
      {
        id: 'containerUUID1',
        type: 'container',
        layout: {
          type: 'flex',
          props: {
            justifyContent: 'start'
          },
        },
        body: [
          {
            id: 'controlId1',
            type: 'componentRef',
            componentID: 'compUUID1'
          },
          {
            id: 'controlId2',
            type: 'componentRef',
            componentID: 'compUUID2'
          },
          {
            id: 'controlId3',
            type: 'componentRef',
            componentID: 'compUUID3'
          },
        ]
      }
    ]
  },

  /** 组件集合 */
  componentsCollection: {
    compUUID1: {
      id: 'compUUID1',
      type: 'component',
      component: {
        type: 'Input',
        field: 'pageContextUUID1'
      },
      props: {},
      actions: {}
    },
    compUUID2: {
      id: 'compUUID2',
      type: 'component',
      component: {
        type: 'Input',
        field: 'pageContextUUID2'
      },
      props: {},
      actions: {}
    },
    compUUID3:{
      id: 'compUUID3',
      type: 'component',
      component: {
        type: 'Button',
        text: '提交'
      },
      props: {},
      actions: {}
    }
  },

  /** 动作集合 */
  actionsCollection: {},

  /** 关系集合 */
  relationshipsCollection: {}
}

export default SimpleCreateUser