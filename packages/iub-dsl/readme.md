- [ ] 系统设计方案制定前：是否有对A/B方案进行优缺点对比和决策
- [x] 是否有业务领域模型
- [x] 是否有系统领域模型（包含用例图）
- [ ] 是否有系统物理部署架构图
- [x] 是否有系统分层架构
- [ ] 是否有核心接口分层架构图
- [ ] 是否有核心接口UML图及说明
- [ ] 是否有核心业务处理时序图（包括业务流程&核心功能处理）
- [ ] 是否有代码工程项目结构
- [ ] 是否有业务核心痛点解决方案
- [ ] 是否有核心性能痛点解决方案
- [ ] 是否有核心安全痛点解决方案
- [x] 是否符合高内聚、低耦合的要求
- [x] 是否有足够的扩展性
- [ ] 功能分解是否完整
- [x] 是否对兼容性进行考虑
- [x] 是否对稳定性进行考虑
- [x] 是否对可维护性进行考虑
- [x] 是否有完整的需求双向跟踪表（需求开发<->架构设计<->概要设计）【模块级】
- [x] 是否有文档变更记录，是否完整

-----

## Changelog

| 作者 | 更新日期 | 备注 |
|---|---|---|
| 相杰 | 2020-06-15 | v1 |

# IUB-DSL 设计

## 引言

> DSL -> System Core

DSL -> Domain specific language，特定领域语言。我们尝试建立一套通用的 DSL 模型，尽可能描述 80% 的通用业务，剩余的需求通过更高阶的实现进行扩展，从而完成「业务可视化生成器」，达到提高生产力的目标。

-----

## 名词解释

- IUB-DSL：如下
- AST：抽象语法树，用于表示程序的源代码结构。这里用于描述业务的抽象结构
- 上下文 context：程序运行过程中产生的变量逻辑运行环境。

-----

## 背景

TODO

## 编写目的和范围

TODO

-----

## IUB-DSL 定义（Definition）

Interaction between User and Business DSL（IUB-DSL）：用户与业务的交互 - DSL。

主要用于「描述」用户如何与业务交互，具体体现为 UI 如何布局、权限如何流转、数据之间的关系，组件之间的关系等。

> IUB-DSL 本质上是 js，在这基础上按照 AST 的规则，每个节点都由 type 进行描述，这样可以将布局与业务抽离，用更抽象的模型来描述「数据」「布局」「控件」「权限」之间的关系。

<!-- -----

## 职责（Responsibilities）

1. 「描述」业务场景
2. 可视化系统生成工具的系统运转中心 -->

-----

## 设计（Design）

IUB-DSL 的核心是「数据」，围绕「数据」的变化（何时变化、如何变化、如何体现变化 -> 渲染页面）链路，制定变化规则，可用于满足大部分业务场景，作为系统的运转核心和依据。

通过将业务数据流向的抽象，抽离出结构化的数据节点，各个节点产生对应的关联，保证数据的变化和流动的方向的正确性，让系统容易扩展和维护。

### IUB-DSL 业务模型

![img](./docs/images/B0前端系统设计%20-%20IUB-DSL模型-模型.png)

IUB-DSL Entity（实例）本质上是一种结构化数据，每个节点遵循单一职责原则（SRP），只对一种类型的任务或实体负责：

前端系统元配置数据：应用的默认配置信息，以及数据处理流程中的默认数据获取链路。

<!-- 上下文接口：

- `sysRtCxtInterface` 与系统运行时上下文的交互接口
- `schemas` 页面运行时上下文的数据模型集合，用于与页面运行时上下文
  - `page` 页面的数据模型
  - `flow` 流程表达式的数据模型

IUB-DSL 信息存储：

- `metadataMapping` 元数据映射集合
- `actionsCollection` 动作集合
- `componentsCollection` 组件集合
- `relationshipCollection` 关系集合
  - `dataPipeData` 数据变更关系管道
  - `componentPipeData` 组件与数据的关系管道
- `layoutContent` 布局信息 -->

-----

## 工作原理

工作原理是 IUB-DSL 模型可行性的验证。

### 运行时上下文（Runtime context -> RtCtx）

![img](./docs/images/B0前端系统设计%20-%20IUB-DSL模型-工作原理.png)

IUB-DSL 在运行时一共由「三种运行时上下文」支撑：

1. 系统运行时上下文 system runtime context（简称 SysRtCtx）
2. 页面运行时上下文 page runtime context（简称 PgRtCtx）
3. 流程运行时上下文 flow runtime context（简称 FlRtCtx）

上下文的通讯规则是：

- 运行时数据传递由上到下，不允许跨级通讯。
- 「页面运行时上下文 PgRtCtx」是平行关系，统一由 SysRtCtx 调度
- 「流程运行时上下文 FlRtCtx」在 PgRtCtx 之中，是业务运行时的数据流转载体

数据规则：

- 每一个数据字段都有一个页面内 UUID
- 需要引用数据的地方只需要引用数据的 UUID 即可
- 只有一个元数据映射与真实数据表有关联，统一出入口

通过上述规则规定了数据的单向流动，确保数据最终的一致性。

-----

### 扩展性、兼容性

IUB-DSL 实际上是定义一种数据运行规则，符合「微内核引擎 -> 插件 -> 业务插件」的插件系统设计思路。

当我们了解了 IUB 中每个功能节点的职能，以及节点与节点之间的关系之后，扩展是很容易的，只需要在对应节点继续添加节点，以及对应的节点解析器即可。扩展的节点集中在「关系集合」与「动作集合」之中。可扩展性也是在这一点上得到体现。

由于是通过节点的增量来满足未来需求，「向前兼容」也得到了保证。

### 可维护性

由于 IUB-DSL 是一份规范、生成的系统的运行依据。通过图示和 Typescript 的 interface 来确保 IUB-DSL 的稳定和可维护性。

<!-- ## IUB-DSL 节点设计原则（Principle）

IUB-DSL 遵循 AST 规则：

1. 每一个节点（node）代表一个功能点（feature）
2. 每个节点（node）需要 `type` 声明节点类型 -->

-----

## 节点图示



## interface 代码事例：

```ts
interface TypeOfIUBDSL {
  /** 页面 ID，用于给其他页面引用 */
  id: string;

  /** 页面类型 */
  type: PageTypes;

  /** 页面名称 */
  name: string;

  /** 与 system runtime context 的接口 */
  sysRtCxtInterface: SRCInterface;

  /** Schema 数据模型 */
  schemas: {
    page: PageSchemas;
    flow: FlowSchemas;
  };

  /** 元数据映射集合 [数据源关系枢纽] */
  metadataCollection: MetadataMappingCollection;

  /** 关系集合 */
  relationshipsCollection: RelationshipsCollection;

  /** 组件集合 */
  componentsCollection: {
    [componentID: string]: ComponentElement;
  };

  /** 动作集合 */
  actionsCollection: {
    [actionID: string]: ActionFlow;
  };

  /** 布局信息 */
  layoutContent: LayoutContentGeneral | LayoutContentCustom;
}
```

-----

## 表达式

第一原则（first principle），「最小的表达式」。

### 执行时机

### 运行时上下文

### 表达式的流程控制

### 流程控制中的表达式

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

## 总结

IUB-DSL 本质上是 js 语法根据 AST 规则来描述的业务的抽象，编辑器负责生产（provide） IBDSL，解析器负责消费（consume） IBDSL，是桥接（bridge）provider 和 consumer 的规范，也是自定义工具的核心。

[typeOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/types/page.ts
[entityOfDSL]: https://github.com/SANGET/custom-platform-tool/blob/master/packages/dsl/core/test/create-user-page.ts
