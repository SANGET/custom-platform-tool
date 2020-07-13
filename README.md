# 可视化编辑器工程方案

采用 `monorepo` 前端工程结构，方便团队独立开发、调试，以及支持分布部署。

-----

## 特性（Feature）

- 通过 yarn workspace 的方式管理所有模块
- 通过 lerna 管理工作区的包关系
- 有多个独立应用模块，可以独立开发

## 技术选型

建议学习

- react
- redux
- webpack
- lerna
- less
- styled-components
- node

-----

## 工程结构（Architecture）

### 目录结构

项目总体方向如下：

- `__test__/` - 测试目录，可以放在任意目录
- `.bak/` - 备份文件
- `.template` 应用参考模版
- `.vscode/` - 编辑器配置
- `dist/` - 打包构建后的文件存放目录
- `docs/` - 文档
- `packages/` - 工作区
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

-----

## 技术选型

- 页面渲染
  - react
- 拖拽技术（选一）
  - react-dnd
  - sortablejs
- 工程化
  - webpack
  - yarn
  - lerna

-----

## 开始（Getting started）

### 准备

```shell
git clone https://github.com/SANGET/custom-platform-tool.git
yarn
```

### 启动「生产工具」

```shell
yarn start:provider-app
```

### 启动「消费工具」

```shell
yarn start:consumer-app
```

-----

## 进阶（Advance）

### 搭建独立应用

在 `packages/` 中对应的目录（根据需要开发的子应用决定，以下以 CustomSubApp 为例）。

> 可以参考[子应用模版](./.template/CustomSubApp/package.json)。

1. 新建文件夹 `CustomSubApp`
2. 在 `CustomSubApp/` 添加 `package.json`
3. 添加 `public/`，可以从模版中 copy
4. 在 `package.json` 的 `scripts` 中添加 `"start": "cross-env PORT=9988 minictl start"`，端口可以自定义
5. 添加 `.mini-scripts.json` 工程化配置文件
6. 添加 `src/app.tsx` 和 `src/index.tsx`，内容参考子应用模版
7. 在最外层的 `package.json` 中添加启动 script: `"start:custom-sub-app": "cd ./package/CustomSubApp && npm start"`
8. 打开命令后输入 `yarn && yarn start:custom-sub-app`，等待片刻即可

### 搭建自定义模块

#### 定义

更多时候需要搭建一些共用的模块，用于提高团队合作效率，以下是搭建过程：

> 可以参考[模块模版](./.template/CustomModule/package.json)。

1. 新建文件夹 `CustomModule`
2. 在 `CustomModule/` 添加 `package.json`

package.json 的必要字段：

```json
{
  "name": "@scope-name/module-name",
  "version": "0.0.1",
  "private": true,
  "author": "SANGET",
  "license": "MIT"
}
```

`name` 的规则是 `npm` 的 `scope` 标准。

完成上述步骤后，需要在项目根目录通过 `yarn` 将模块连接起来（link），link 工作由 yarn 和 lerna 完成。

#### 使用

通过上述操作后，其他模块可以引用 `@scope-name/module-name` 中的模块：

```ts
import { moduleName } from '@scope-name/module-name';

moduleName();
```

-----

## 测试

通过 jest 测试，可以在需要测试的模块的目录下新建 `__test__` 目录并且写测试用例。然后在项目根目录执行 `yarn test` 即可进行测试。

-----

## 部署

### CI

持续集成 - 测试，每个提交都可以通过 CI 工具做持续集成。

TODO

### CD

持续部署，通过分支管理，根据制定的功能分支做持续部署。

TODO

-----

## 最后

Thanks
