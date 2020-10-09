# 配置平台 - 前端接入

## 1. 基础 UI 规则

在这里是最上层的业务应用层，可以直接调用相应的 UI 库

---

## 2. 子应用接入

### 2.1. 一般子应用

一般子应用可以是 `HY.SubApp`，类型，例如最简单的应用：

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

### 2.2. HOC 子应用

如果我们需要通过 HOC 方式放回一个组件，需要实现 `HY.SubAppHOC` 方法：

```tsx
import React from "react";

const SubApp: HY.SubAppHOC = (props) => {
  return () => {
    const {
      appLocation, pagePath
    } = props;
    return VisualEditorStoreConnector(PageDesigner, pagePath);
  }
}

export default App;
```

### 2.3. 业务应用模块

TODO

### 2.4. 管理应用模块

TODO

### 接入应用大厅 (EntryHall)

1. 在 `packages/provider-app-hub` 中添加一个子应用，模版参考 `.template/CustomSubApp`
2. 在 `packages/provider-app-entry/config/router` 应用入口配置中添加对应的路由：

```ts
import { 子应用 } from './path'

const RouterConfig: RouterConfigType = {
  ...,
  '/路由信息': {
    component: 子应用,
    title: '路由名字'
  },
};
```

3. 在 `packages/provider-app-entry/config/menu-data` 中添加菜单信息：

```ts
/**
 * 支持无限嵌套
 */
export interface MenuDataType {
  /** 菜单名 */
  title: string
  /** icon */
  icon: string
  /** 菜单 id，用于 react 的 key */
  id: string
  /** 导航将要到达的 path */
  path?: string
  /** children，如果有，则认为点击没有跳转功能 */
  children?: MenuDataType[]
}
```

4. 子应用接入完成

---

## 3. HTTP 工具规范

1. 通过引用全局的变量 `$R_P` HTTP 工具，该工具的定义在 `EntryHall/src/services/http-handler.ts` 中
   1. 解释：`R`equest helper for `P`rovider app，简写 `R_P`，`$` 是全局变量前缀
2. HTTP 工具暂时基于 `@mini-code/request`，可以针对不同的请求地址、基础 url 进行对应灵活的封装，例如：
   1. 认证中心：`url/auth`
   2. 平台服务：`url/platform`

### 3.1. 参考

- [request tool 文档参考](https://github.com/minimal-studio/request)
- [$R_P 定义](EntryHall/src/services/http-handler.ts)

---

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

### 4.4. 设置默认 url query string

由于自定义工具 3.0 采用了 RESTFul 请求机制，格式如下：

```ts
const url = `${protocal}://${domain}/paas/${lessee}/${application}/${api}`
```

- lessee 租户，根据登入的租户动态改变
- application 应用，根据选择的应用动态改变
- api 标准的 restful api，根据具体接口，一般是静态的

前端采用了路由与页面分离的策略，所以上述的信息有一部分是挂载在浏览器 URL
中的。所以这里需要有一个统一的地方设置 url，能够达到灵活响应 lessee 和 application 的动态改动：

```ts
/** 在 http-handle.ts 中统一设置请求 */
import { setDefaultParams, clearDefaultParams } from "multiple-page-routing";

/** 根据登录用户、选择的应用，设置默认的 url params */
setDefaultParams({
  lessee,
  app
});

/** 登出是清除默认路由 */
clearDefaultParams();
```
