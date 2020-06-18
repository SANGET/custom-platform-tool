- [ ] 系统设计方案制定前：是否有对A/B方案进行优缺点对比和决策
- [x] 是否有业务领域模型
- [x] 是否有系统领域模型（包含用例图）
- [ ] 是否有系统物理部署架构图
- [x] 是否有系统分层架构
- [x] 是否有核心接口分层架构图
- [x] 是否有核心接口UML图及说明
- [ ] 是否有核心业务处理时序图（包括业务流程&核心功能处理）
- [x] 是否有代码工程项目结构
- [x] 是否有业务核心痛点解决方案
- [x] 是否有核心性能痛点解决方案
- [x] 是否有核心安全痛点解决方案
- [x] 是否符合高内聚、低耦合的要求
- [x] 是否有足够的扩展性
- [ ] 功能分解是否完整
- [x] 是否对兼容性进行考虑
- [x] 是否对稳定性进行考虑
- [x] 是否对可维护性进行考虑
- [x] 是否有完整的需求双向跟踪表（需求开发<->架构设计<->概要设计）【模块级】
- [x] 是否有文档变更记录，是否完整

-----

[[toc]]

# IUB-DSL工作原理详细设计

-----

## Changelog

| 作者 | 更新日期 | 备注 |
|---|---|---|
| 相杰 | 2020-06-15 | v1 |

## 引言

&gt; IUB-DSL -&gt; System Core

我们尝试建立一套通用的 DSL 模型，尽可能描述 80% 的通用业务，剩余的需求通过更高阶的实现进行扩展，从而完成「业务可视化生成器」，达到提高生产力的目标。

-----

## 名词解释

- AST：抽象语法树，用于表示程序的源代码结构。这里用于描述业务的抽象结构。
- 上下文 context：程序运行过程中产生的变量逻辑运行环境。

-----

## 背景

低代码平台是高生产力的工具的代表之一，也是技术改革生产关系的未来发展的方向之一。为了构建一个运行良好、易于扩展、维护的低代码平台，来支持未来无限的业务场景，于是建立了 IUB-DSL 模型，来支持低代码系统的运行。

## 编写目的和范围

- 验证 IUB-DSL 的可行性
	- 阐明 IUB-DSL 的工作原理
- 阐明 IUB-DSL 的设计思路
- 阐明 IUB-DSL 的系统体系
	- 指导其他模块的设计
- 阐明 IUB-DSL 的接口规则

-----

## IUB-DSL 定义（Definition）

Interaction between User and Business DSL（IUB-DSL）：用户与业务的交互 - DSL。

主要用于「描述」用户如何与业务交互，具体体现为 UI 如何布局、权限如何流转、数据之间的关系，组件之间的关系等。

&gt; IUB-DSL 本质上是 js，在这基础上按照 AST 的规则，每个节点都由 type 进行描述，这样可以将布局与业务抽离，用更抽象的模型来描述「数据」「布局」「控件」「权限」之间的关系。

-----

## 设计（Design）

### IUB-DSL 设计思路

IUB-DSL 的核心是「数据」，围绕「数据」的变化（何时变化、如何变化、如何体现变化 -&gt; 渲染页面）链路，制定变化规则，可用于满足大部分业务场景，作为系统的运转核心和依据。

通过将业务数据流向的抽象，抽离出结构化的数据节点，各个节点产生对应的关联，保证数据的变化和流动的方向的正确性，让系统容易扩展和维护。

### IUB-DSL 业务模型

IUB-DSL Entity（实例）本质上是一种结构化数据，每个节点遵循单一职责原则（SRP），只对一种类型的任务或实体负责：

![图片描述](/tfl/pictures/202006/tapd_41909965_1592387448_4.png)

前端系统元配置数据：应用的默认配置信息，以及数据处理流程中的默认数据获取链路。

### IUB-DSL 系统模块 UML

以下为围绕 IUB-DSL 延伸的系统体系 UML：

![图片描述](/tfl/pictures/202006/tapd_41909965_1592376933_43.png)

-----

## IUB-DSL 工作原理（Working principle）

工作原理是 IUB-DSL 模型可行性的验证。

工作原理图概览：

![图片描述](/tfl/pictures/202006/tapd_41909965_1592358923_88.png)

### 运行时上下文（Runtime context -&gt; RtCtx）

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

### 扩展性、兼容性

IUB-DSL 实际上是定义一种数据运行规则，符合「微内核引擎 -&gt; 插件 -&gt; 业务插件」的插件系统设计思路。

当我们了解了 IUB 中每个功能节点的职能，以及节点与节点之间的关系之后，扩展是很容易的，只需要在对应节点继续添加节点，以及对应的节点解析器即可。扩展的节点集中在「关系集合」与「动作集合」之中。可扩展性也是在这一点上得到体现。

由于是通过节点的增量来满足未来需求，「向前兼容」也得到了保证。

### 可维护性

由于 IUB-DSL 是一份规范、生成的系统的运行依据。通过图示和 Typescript 的 interface 来确保 IUB-DSL 的稳定和可维护性。

### 稳定性

IUB-DSL 数据处理方式是基于「数据管道 pipe（单向数据流）」的，数据管道确保了数据变化的顺序、流动方向，以及数据的变化跟踪的运作，从而体现系统稳定性。

### 系统性能

由于系统都是由多个独立模块通过关系组合而成，如果遇到性能问题，可以方便定位性能瓶颈，从而找到更合适的性能解决方案。

### 核心安全

IUB-DSL 的运行时数据是统一存放以及处理的，所以可以轻松在数据读写的模块加入加密算法，保障系统数据安全。

-----

## IUB-DSL 工程设计（Design of engineering）

### 接口规范（IUB-DSL interface spec）

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

### 系统目录结构（Project files structure）

- iub-dsl
	- core 定义核心接口
	- parser 核心模块解析器
	- runtime 解析结果的运行时模块
	- demo 存放场景用例
	- docs 存放文档

-----

## 业务痛点

### 规范

过去的 2.x 平台的数据变化规则并不够明确，所有的数据变化关系都围绕「控件」之间的订阅发布来处理，而且缺乏变化的链路标准，缺少恒之有道的可扩展模型。所以导致随着业务场景的增加，系统越发难以承受和扩展。

### 便于业务扩展

这就是 IUB-DSL 需要解决的问题：制定一个可控可靠的数据变化标准，建立一套易于扩展、维护的体系，让一切的系统变化有根可循，从而更容易应对未来的变化。

-----

## 参考（Reference）

- [IUB-DSL 项目结构](https://github.com/SANGET/custom-platform-tool/tree/master/packages/iub-dsl)
-  [真实业务场景 - 新增用户](https://github.com/SANGET/custom-platform-tool/blob/master/packages/iub-dsl/demo/business-case/create-user.ts)
- [IUB-DSL 属性思维导图](https://www.tapd.cn/41909965/documents/view/1141909965001001059?file_type=mindmap&amp;file_ext=xmind)

### IUB-DSL 工作原理完整版

![图片描述](/tfl/pictures/202006/tapd_41909965_1592383065_58.png)

### IUB-DSL 模型完整版

![图片描述](/tfl/pictures/202006/tapd_41909965_1592387478_95.png)