# 可视化编辑器工程方案

## 结构

- 通过 yarn workspace 的方式管理所有模块
- 有多个独立应用模块，可以独立开发，最后通过 ./packages/provider-app-hub/EntryHall 加载所有需要模块，体现为「工作台」

## 技术选型

- react
- webpack

## 模型

- IUB-DSL 模型

## 开始

### 准备

```shell
git clone https://github.com/SANGET/custom-platform-tool.git
yarn
```

### 启动「工作台」

```shell
yarn start start:hall-app
```

### 单独启动子应用

```shell
yarn start start:page-designer
# ... 可以编写更多 cli 支持
```

## 协作

TODO

## 部署

TODO
