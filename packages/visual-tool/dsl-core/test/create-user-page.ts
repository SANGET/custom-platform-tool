import { PageDefination } from '../types/page';

export const CreateUserPage: PageDefination = {
  id: 'qqq',
  type: 'config',
  name: '用户管理',
  status: 'edit',
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
              required: true,
              expression: (input) => {
                const f = new Function(input);
                return f();
              }
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
              fieldHook: {
                before: () => ({}),
                after: () => ({}),
              },
              required: false,
              dataSource: {
                tableName: 'TreeTable'
              }
            },
            // 存疑
            props: {
              default: {
                // props
              },
              editor: {
                // props
                // ... style
              },
              detail: {
                // ... style
              }
            },
            lifecycle: {
              onMount: () => ({}),
              onUnmount: () => ({}),
            },
            userBehavior: {
              onClick: (e, {
                b
              }) => {
                let a = maping(e);
                a = xhr(a);
                const step1 = new Promise();
                const step2 = new Promise();
                const step3 = new Promise();
                Promise.all([
                  step1, step2, step3
                ]);
                await serviceA(a);
                await serviceB(a);
                await serviceC(a);
              },
              onTap: () => ({}),
            },
          },
          {
            id: '66',
            type: 'component',
            component: {
              type: 'Button',
              text: '录入'
            },
            props: {

            }
          },
        ],
      }
    ]
  }
};
