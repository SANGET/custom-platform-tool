# 可视化编辑器工程方案

采用 `monorepo` 前端工程结构，方便团队独立开发、调试，以及支持分布部署。

---

## 1. 特性（Feature）

- 通过 yarn workspace 的方式管理所有模块
- 通过 lerna 管理工作区的包关系
- 有多个独立应用模块，可以独立开发

## 2. 技术选型

- 工程管理
  - webpack
  - yarn
  - lerna
- 前端
  - 页面渲染
    - react
    - less
    - sass
    - styled-components
  - 数据管理
    - redux
  - 基础工具
    - rxjs
  - 拖拽技术
    - react-dnd
- 服务
  - node
  - nest
    - MVC 框架，强依赖 ts、依赖注入的方式进行开发，node 版的 spring

---

## 3. 工程结构（Architecture）

### 3.1. 目录结构

项目总体方向如下：

- `__test__/` - 测试目录，可以放在任意目录
- `.bak/` - 备份文件
- `.template` 应用参考模版
- `.vscode/` - 编辑器配置
- `dist/` - 打包构建后的文件存放目录
- `docs/` - 文档
- `web-server` - 配置端 web 资源服务
- `packages/` - 工作区
  - `spec` - 接入标准
    - `BusinessComponent` - 业务组件接入标准，在配置端和应用端都使用的组件
  - `provider-app-entry/` - 生产工具入口
  - `provider-app-hub/` - 生产工具 app 集合
    - `[App]` 根据实际需要开发的 app
  - `consumer-app/` - "消费" 生成工具的产出的 app
    - `web-client/` - web 客户端实现
    - `web-server/` - web 服务端实现
  - `iub-dsl/` - 生产工具和消费 app 之间的约定数据结构的定义，根据 IUB-DSL 模型的 interface 实现
    - `core/` - IUB-DSL 核心定义
    - `parser/` - IUB-DSL 解析器集合
    - `demo/` - `{顾名思义}`
    - `docs/` - IUB-DSL 专属文档
  - `engine/` - 核心引擎，用于驱动应用
    - `visual-editor/` - 可视化编辑器引擎
    - `admin-container/` - 管理应用的运行容器框架
  - `infrastructure/` - 基础设施支持
    - `data-transformer/` - 数据转换器
      - `restful/` - restful 转换器
      - `apb-dsl/` - apb-dsl 转换器
    - `env-scripts/` - 项目工程化基础 scripts
    - `multiple-page-routing/` - 多页路由机制
    - `remote-communication-services/` - 远端通讯服务
    - `ui/` - UI 隔离层
    - `utils/` - 通用工具
- `.eslintignore` - eslint 中`需忽略的项`配置
- `.eslintrc` - eslint 配置
- `.gitignore` - git 中`需忽略的项`配置
- `jest.config.js` - jest 配置
- `lerna.json` - lerna 配置
- `package.json` - 工程 package json 配置
- `README.md` - 工程总说明文档
- `tsconfig.json` - typescript 的配置

---

## 4. 开始开发（Getting started）

### 4.1. 准备

```shell
git clone https://github.com/SANGET/custom-platform-tool.git
yarn
```

### 4.2. 启动「生产工具 - 配置前端」

```shell
sh ./scripts/start-provider-app.sh
```

### 4.3. 启动「应用前端」

```shell
yarn start:consumer-app
```

### 4.4. 启动「web 资源服务」

```shell
cd ./web-server
yarn start:dev
```

## 部署说明

- [参考](./docs/工程/deployment.md)

---

## 5. 进阶（Advance）

- [搭建独立应用](./docs/工程/write-sub-app.md)

---

## 6. 配置端接入

[配置端接入参考文档](./packages/provider-app-hub/README.md)

---

## 7. 应用端接入

---

## 8. 共用 UI

如何编写共用的 UI？[点击查看](./packages/infrastructure/ui/README.md)

---

## 9. 测试

通过 jest 测试，可以在需要测试的模块的目录下新建 `__test__` 目录并且写测试用例。然后在项目根目录执行 `yarn test` 即可进行测试。

每一个子应用都可以在自身目录的根目录下创建 `__test__` 文件夹，并且添加单元测试用例。

---

## 11. 最后

Thanks
