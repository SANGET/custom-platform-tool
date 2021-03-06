# 2020-09-27 - code review 记录

- 主持人：相杰
- 参与人：温凌敏、黄俊生、李佳、胡东亮、蒋国才、张相杰

## 1. 页面设计器

模块负责人：相杰

由相杰讲述页面设计器的整体实现思路，组件接入规范，属性项接入规范，并且现场演示如何在不改动「可视化编辑器引擎」和「页面设计器」的情况下接入组件和属性项。

### 1.1. 问题和建议

| 问题             | 解决方案 | 提出者 | 备注                                                         |
| ---------------- | -------- | ------ | ------------------------------------------------------------ |
| connector 是什么 |          | 温凌敏 | 是链接可视化编辑器引擎提供的 redux 状态管理器和页面设计器的 React UI 的 |
|                  |          |        |                                                              |

## 2. 应用框架

模块负责人：东亮

由东亮讲述应用端框架的实现思路和细节。

### 2.1. 问题和建议

| 问题 | 解决方案 | 提出者 | 备注 |
|---|---|---|---|
| 验证 —— 权限访问的一般做法，在路由那里做拦截还是在页面渲染前做拦截。 |---|黄俊生|---|
| 尽量减少使用 window 对象 ||黄俊生||
| 工程的目录结构，不能太深 ||黄俊生||
| 命名空间的必要性。 |后续详细讨论命名空间在前端工程是否必要。|黄俊生||
| ProLayout 需要考虑集成度和自由度之间的平衡。 |目前阶段需要快速搭建应用，可以采用该脚手架的方案|相杰||

## 3. IUB-DSL 引擎

模块负责人：国才

### 3.1. 问题和建议

| 问题 | 解决方案 | 提出者 | 备注 |
|---|---|---|---|
| IUB-DSL/types 文件夹命名含义不明确 | 将 IUB-DSL/types 改为 IUB-DSL/definition，明确目录为数据结构定义 | 张相杰 | - |
| IUB-DSL/definition 文件夹应该是明确的，只描述 IUB-DSL 数据结构本身，但包含了 engine 名词，容易混淆 | 将有 engine 的目录名重命名，去除 engine | 张相杰 | - |
| IUB-DSL/apb-dsl 文件夹不应该在 iub-dsl 目录下 | 后续更新将该目录移到适合的地方 | 张相杰 | - |
| 其他，见 gitlab 中的评论 |  | 张相杰 ||
| IUB-DSL 中的“通信标准”究竟是什么意思？ |  | 张相杰 |指国才自己定义的，IUB-DSL 引擎内部模块的数据交互的数据格式的约定，建议把名词修改为通俗易懂的|
| 必须解释清楚自定义数据结构 `{key[]/key2/}` 的作用。 |  |  |实际上是将递归嵌套的 json 结构转换成扁平的数据结构，用于快速查找节点的值。|
|  |  |  ||
|  |  |  ||
