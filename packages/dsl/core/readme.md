# DSL-Core

## IUBDSL 定义（Definition）

Interaction between User and Business DSL（IUBDSL）：用户与业务的交互 DSL

实际上指的是由 JS 语法来描述的、抽象于「业务」和「元素布局」的 AST。所以 IUBDSL 在本质上是业务 AST。

-----

## 职责（Responsibilities）

IUBDSL 的主要职责：规范编辑器的 IUBDSL 输出，规范解析器的解析渲染。是桥接「编辑器」和「解析器」的接口规范，也是描述大部分业务场景的核心准则规范。

-----

## 实现（Implement）

type definition：查看 [`./types/page.ts`][typeOfDSL]

场景「录入用户」案例：查看 [`./test/create-user-page.ts`][entityOfDSL]

-----

## IUBDSL 设计（Design of IBDSL）

### 设计原则（Principle）

IUBDSL 遵循 AST 规则：

1. 每一个功能点（feature）描述为一个节点（node）
2. 每个节点需要由 `type` 说明节点类型

### 功能节点设计

> 具体定义在 [`./types/page.ts`][typeOfDSL] 中

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

编辑器的最主要职能是：输出 IUBDSL 的实例内容，包括将动作（action）和表达式（expression）片段插入到 IUBDSL 实例中，然后交给存储服务存储。

### 与解析器（parser）的交互

解析器的最主要职能是：根据已有的 IUBDSL 实例进行运行时解析，包括其中的动作（action）和表达式（expression）的执行，用户的交互等。

-----

## 总结

IUBDSL 本质上是 js 语法根据 AST 规则来描述的业务的抽象，编辑器负责生产（provide） IBDSL，解析器负责消费（consume） IBDSL，是桥接（bridge）provider 和 consumer 的规范，也是自定义工具的核心。

[typeOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/types/page.ts
[entityOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/test/create-user-page.ts
