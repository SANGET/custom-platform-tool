import { PageDefination } from '../types/page';

const CreateUserPage: PageDefination = {
  id: 'qqq',
  type: 'config',
  name: '用户管理',
  dataSource: {
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
            props: {

            },
            lifecycle: {
              onMount: () => ({}),
              onUnmount: () => ({}),
            },
            userBehavior: {
              onClick: () => ({}),
              onTap: () => ({}),
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
  }
};
