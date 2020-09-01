# 配置平台 - 前端接入规范

## 1. 基础 UI 规则

在这里是最上层的业务应用层，可以直接调用相应的 UI 库

## 2. 子应用开发规范

### 2.1. 子应用类型

每个子应用必须是 `HY.SubApp`，类型，例如最简单的应用：

```tsx
import React from "react";

const SubApp: HY.SubApp = (props) => {
  return (
    <div>
      子应用
    </div>
  );
};

export default SubApp;
```

`HY.SubApp` 提供最基本的子应用类型检查，并且提供`页面上下文接口`，便于开发子应用。

### 2.2. 业务应用模块

TODO

### 2.3. 管理应用模块

TODO

## 3. HTTP 工具规范

1. 通过引用全局的变量 `$R_P` HTTP 工具，该工具的定义在 `EntryHall/src/services/http-handler.ts` 中
   1. 解释：`R`equest helper for `P`rovider app，简写 `R_P`，`$` 是全局变量前缀
2. HTTP 工具暂时基于 `@mini-code/request`，可以针对不同的请求地址、基础 url 进行对应灵活的封装，例如：
   1. 认证中心：`url/auth`
   2. 平台服务：`url/platform`

### 3.1. 参考

- [request tool 文档参考](https://github.com/minimal-studio/request)
- [$R_P 定义](EntryHall/src/services/http-handler.ts)

## 4. 路由

### 4.1. 概述

目前暂定由 `multiple-page-routing` 统一管理`provider-app-hub`的路由，可以通过 `import {  } from multiple-page-routing` 获取组件或方法。

### 4.2. 使用

#### 4.2.1. 通过 Link 组件链接

通过 Link 组件，可以轻松实现路由跳转。

```tsx
import React from "react";
import { Link } from "multiple-page-routing";

const SubApp: HY.SubApp = (props) => {
  return (
    <div>
      <h2>页面管理器</h2>
      <Link
        to="/page-designer"
        params={{
          id: '123',
          object: {
            id: '123124'
          }
        }}
      >
        创建页面
      </Link>
      <ul>
        <li>页面1，点击管理</li>
      </ul>
    </div>
  );
};

export default SubApp;
```

### 4.3. 获取当前路由信息

只要是 `HY.SubApp` 的子应用（参考第 2 章），接入了的应用开发，都会接收到当前的路由信息：

```tsx
import React from "react";
import { Link } from "multiple-page-routing";

const App: HY.SubApp = (props) => {
  console.log(props) // 查看当前的上下文
  return (
    <div>
      子应用
    </div>
  );
};

export default App;
```
