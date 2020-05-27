# DSL-Core

## IUB-DSL 定义（Definition）

Interaction between User and Business DSL（IUB-DSL）：用户与业务的交互 DSL

主要用于描述用户如何与业务交互，以及 UI 布局。

> 实际上，指的是由 JS 语法来描述的、抽象于「业务」和「元素布局」的 AST。所以 IUB-DSL 在本质上是业务 AST，以 JSON 形式存在。

-----

## 职责（Responsibilities）

IUB-DSL 的主要职责：规范编辑器的 IUB-DSL 输出，规范解析器的解析渲染。是桥接「编辑器」和「解析器」的接口规范，也是描述大部分业务场景的核心准则规范。

-----

## IUB-DSL 设计（Design of IBDSL）

### 设计原则（Principle）

IUB-DSL 遵循 AST 规则：

1. 每一个功能点（feature）描述为一个节点（node）
2. 每个节点需要由 `type` 说明节点类型

### 功能节点设计

- 页面 page
  - id
  - name
  - type
  - dataSource
  - content
    - type
    - child[]
      - ElementType
        - container
          - layout
            - type
            - props -> layout info
        - component
          - type
          - userBehavior
            - onClick
            - onChange
            - onTap
          - lifecycle
            - onMount
            - onUnmount
          - expression

-----

## 交互

### 与编辑器（editor）的交互

编辑器的最主要职能是：输出 IUB-DSL 的实例内容，包括将动作（action）和表达式（expression）片段插入到 IUB-DSL 实例中，然后交给存储服务存储。

### 与解析器（parser）的交互

解析器的最主要职能是：根据已有的 IUB-DSL 实例进行运行时解析，包括其中的动作（action）和表达式（expression）的执行，用户的交互等。

-----

## 实现（Implement）

type definition：查看 [`./types/page.ts`](https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/types/page.ts)

### 场景「录入用户」案例

这里是直接案例，用于展示如何承载实际业务：

```ts
import { PageDefination } from '../types/page';

export const CreateUserPage: PageDefination = {
  id: 'id',
  type: 'config',
  name: '用户管理',
  status: 'edit',
  dataSource: {
    type: 'general',
    tableName: 'User',
  },
  content: {
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
              expression: (input) => {
                const f = new Function(input);
                return f();
              },
            },
            // 该组件在页面生命周期中的回调动作（callback）
            lifecycle: {
              onMount: () => ({}),
              onUnmount: () => ({}),
            },
            /**
             * 承载所有动作，所有的动作都可以通过 [动作] 来描述操作
             *
             * 格式为 [事件 event]: [动作 action]
             *
             * 动作：动作的回调参数中有当前页面的「上下文状态」，用于在运行时获取页面信息，包括一切需要的信息
             */
            actions: {
              onClick: (context) => {
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
              onTap: () => ({}),
              onChange: () => ({}),
              onFocus: () => ({}),
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
            actions: {
              onClick: (e, {
                b
              }) => {
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
            actions: {
              onClick: (context) => {
                // 提交，可以是库表操作
                context.submit();
              },
              onTap: () => ({}),
            },
            props: {

            }
          },
        ],
      }
    ]
  }
};
```

-----

## 总结

IUB-DSL 本质上是 js 语法根据 AST 规则来描述的业务的抽象，编辑器负责生产（provide） IBDSL，解析器负责消费（consume） IBDSL，是桥接（bridge）provider 和 consumer 的规范，也是自定义工具的核心。

[typeOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/types/page.ts
[entityOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/test/create-user-page.ts
