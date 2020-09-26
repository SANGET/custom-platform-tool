# 可视化编辑器的规则

## 目录结构

- app-mock/ 模拟的可视化编辑器应用，提供「使用事例」，外部一般不需要引用该目录
- components/ 提供给外部使用的可视化编辑器引擎的基础组件
- core/ 可视化编辑器引擎的核心处理流程，使用 redux 编写，提供 connector 链接组件与 redux
- data-structure/ 可视化编辑器引擎的数据结构定义
- spec/ 接入规范
- utils/ 提供的工具类
