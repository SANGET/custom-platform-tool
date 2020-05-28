# DSL-Core

这里将 DSL 视为「可视化工具」的核心中枢，基于 DSL 构建上层应用。

## IUB-DSL 定义（Definition）

Interaction between User and Business DSL（IUB-DSL）：用户与业务的交互 DSL。

主要用于「描述」用户如何与业务交互，具体体现为 UI 如何布局、权限如何流转、数据之间的关系，组件之间的关系等。

> IUB-DSL 本质上是 js，在这基础上按照 AST 的规则，每个节点都由 type 进行描述，这样可以将布局与业务抽离，用更抽象的模型来描述「数据」「布局」「控件」「权限」之间的关系。

-----

## 职责（Responsibilities）

1. 「描述」业务场景
2. 规范核心模块的输入输出（I/O），规范编辑器如何输出 IUB-DSL，通知解析器如何工作

-----

## 设计（Design）

### IUB-DSL 设计原则（Principle）

IUB-DSL 遵循 AST 规则：

1. 每一个节点（node）代表一个功能点（feature）
2. 每个节点（node）需要 `type` 声明节点类型

### IUB-DSL 解析器原则

IUB-DSL 解析器（parser）由针对每一个不同的 type 设计实现一个专门的子解析器（sub-parser for type）组成。

如是可以针对子解析器进行调试、测试，这样可以降低耦合，增强解析器的稳定性。

### IUB-DSL 编辑器原则

TODO

-----

## 模块间关系（relationship between modules）

### 与编辑器（editor）的关系

编辑器负责输出 IUB-DSL 实例。将运行代码片段插入到 IUB-DSL 实例中。

### 与解析器（parser）的关系

解析器负责根据已有的 IUB-DSL 输入进行解析。包括处理节点之间的关系。

-----

## 实现细节（Detail of Implement）

type definition：查看 [`./types/page.ts`](https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/types/page.ts)

### 场景「录入用户」案例

这里是直接案例，用于展示如何承载实际业务：

```ts
import { PageDefination } from '../types/page';

export const CreateUserPage: PageDefination = {
  id: 'id',
  type: 'config',
  name: '用户管理',
  outputData: {
    type: '',
    value: () => ({})
  },
  dataSourceHub: {
    type: 'general',
    tableName: 'User',
  },
  contentHub: {
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
  componentsHub: {
    22: {
      id: '22',
      type: 'component', // 实际控件，不具备布局功能，专注交互功能
      component: {
        // 控件类型，这里系统内置了足够的控件
        type: 'Input',
        field: 'username', // 对应数据库的 field
        fieldHook: { // 获取数据库字段的钩子回调动作（callback）
          before: () => ({}),
          after: () => ({}),
        },
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
  actionsHub: {
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
    'business-submit': (context) => {
      // 提交
      context.submit();
    }
  }
};
```

-----

## 总结

IUB-DSL 本质上是 js 语法根据 AST 规则来描述的业务的抽象，编辑器负责生产（provide） IBDSL，解析器负责消费（consume） IBDSL，是桥接（bridge）provider 和 consumer 的规范，也是自定义工具的核心。

[typeOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/types/page.ts
[entityOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/test/create-user-page.ts
