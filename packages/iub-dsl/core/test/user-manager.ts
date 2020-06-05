import { TypeOfIUBDSL } from '../types/page';

const UserManager: TypeOfIUBDSL = {
  id: 'qqq',
  type: 'config',
  name: '用户管理',
  relationshipsHub: {

  },
  dataSourceHub: {
    type: 'general',
    tableName: 'User',
  },
  content: {
    type: '',
    child: [
      {
        id: '1',
        type: 'container',
        layout: {
          type: 'flex',
          props: {
            justifyContent: 'start',
            justifyItems: 'start'
          }
        },
        body: [
          {
            id: '22',
            type: 'component',
            component: {
              type: 'Input',
              field: 'username',
              required: true
            },
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
            id: '33',
            type: 'component',
            component: {
              type: 'Button',
            },
            actions: {
              onClick: {
                type: 'actionRef',
                actionID: 'business-submit'
              },
            },
          },
          {
            id: '55',
            type: 'component',
            component: {
              type: 'Table',
              dataSource: {}
            },
          },
        ],
      }
    ]
  },
  actionsHub: {
    'business-submit': (context) => {
      /**
       * 这里主要是为了获取数据
       *
       * 获取数据之前做的操作，以及获取数据以后的操作，以后详细设计
       */

      let resData;
      if (context.pageState.age > 10) {

      } else {
        resData = context.query({
          params: ['username', 'age']
        });
      }
      return resData;
    },
    // bus: {
    //   handle: (context) => {
    //     let data = [];
    //     data = context.fliterRelation({
    //       filterRelation,
    //       data,
    //     });
    //     return data;
    //   },
    //   condition: [],
    //   queryRelation: [],
    //   fliterRelation: [], // TODO: {} // 过滤数据
    //   layyoutRelation: [],
    // }
  }
};
