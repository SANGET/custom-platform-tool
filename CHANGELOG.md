# CHANGELOG

## 2020-08-04

### breaking change

1. 将 @infra/env-scripts 改名为 @infra/react-dev-env-scripts
2. 将 react 与 react-dom 的依赖整合到 @infra/react-dev-env-scripts 中
3. 依赖 @infra/react-dev-env-scripts 的子应用不再需要在自身目录依赖 react react-dom

### 文件名调整

1. 将所有 react component 相关的文件都采用大写开头的驼峰命名
2. packages/utils 目录下调整各工具的目录结构，包含测试用例的结构
