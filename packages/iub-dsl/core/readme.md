# DSL-Core

这里将 DSL 视为「可视化工具」的核心中枢，基于 DSL 构建上层应用。

## IUB-DSL 定义（Definition）

Interaction between User and Business DSL（IUB-DSL）：用户与业务的交互 DSL。

主要用于「描述」用户如何与业务交互，具体体现为 UI 如何布局、权限如何流转、数据之间的关系，组件之间的关系等。

更进一步来说，IUB-DSL 是一种 MVC 模式的描述，更关注于「数据」层面，统一处理数据（Controller），统一存储运行时数据（Model），统一页面渲染（View）

> IUB-DSL 本质上是 js，在这基础上按照 AST 的规则，每个节点都由 type 进行描述，这样可以将布局与业务抽离，用更抽象的模型来描述「数据」「布局」「控件」「权限」之间的关系。

-----

## 职责（Responsibilities）

1. 「描述」业务场景
2. 规范核心模块的输入输出（I/O），规范编辑器如何输出 IUB-DSL，通知解析器如何工作

-----

## 设计（Design）

IUB-DSL Entity（实例）本质上是一种结构化数据存储，每个节点负责对应的数据的存储。详情如下：

- metadataMapping 元数据映射集合，用于对应

### IUB-DSL 设计原则（Principle）

IUB-DSL 遵循 AST 规则：

1. 结构化数据存储
2. 每一个节点（node）代表一个功能点（feature）
3. 每个节点（node）需要 `type` 声明节点类型

### 运行时上下文（Runtime context）

> 这里指的是「应用平台 web 前端」的运行时上下文。IUB-DSL 从另一个角度看，是描述数据如何在不同的运行时上下文中流转。

「应用平台 web 端」在运行时一共会由「三种运行时上下文」：

1. 系统运行时上下文 system runtime context（简称 SRC）
2. 页面运行时上下文 page runtime context（简称 PRC）
3. 表达式运行时上下文 expression runtime context（简称 ERC）

上下文的通讯规则是：

- 运行时数据传递由上到下，不允许跨级通讯。
- 运行时数据统一存储在「系统运行时上下文 SRC」之中
- 「页面运行时上下文 PRC」是平行关系，并且统一由 SRC 管理
- 「表达式运行时上下文 ERC」在 PRC 之中，是业务运行时的数据流转载体

通过上述规则规定了数据的单向流动，确保数据一致性。

-----

那么 IUB-DSL 是如何描述数据在上下文中的流转？

1. 描述一个独立页面需要从 SRC 中获取什么数据
2. 描述输出什么数据到 SRC 中
3. 描述 UI 控件如何触发事件（how），触发什么事件（what）
4. 描述来自 UI 或者系统生命周期回调的「事件的工作流程」，就是如何更改运行时数据
   1. 何时调用
      1. onChange
   2. 如何调用
      1. 程序流程控制
      2. 变量获取
         1. 系统变量
         2. 页面变量
         3. 控件变量
      3. 更改数据
         1. 通过一次更改通过一个表达式完成一个数据的更改

以上是 IUB-DSL 的数据流转规则，通过 1 2 描述页面之间的通讯，通过 3 4 描述页面内部如何工作，更改运行时数据。

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
```

-----

## 表达式

图灵完备。

我们需要图灵完备的表达式，用于描述所有由用户或者系统触发的 action 的可计算处理过程。

-----

## 总结

IUB-DSL 本质上是 js 语法根据 AST 规则来描述的业务的抽象，编辑器负责生产（provide） IBDSL，解析器负责消费（consume） IBDSL，是桥接（bridge）provider 和 consumer 的规范，也是自定义工具的核心。

[typeOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/types/page.ts
[entityOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/test/create-user-page.ts
