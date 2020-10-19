# 介绍

配置平台--权限管理应用模块, poc3.1版本目前只包含权限项，权限树两个功能模块

## 开始（Getting started）

### 准备

```shell
git clone git@10.0.4.55:custom-platform-v3-frontend-group/custom-platform-v3-frontend.git
yarn
```

### 目录结构

项目总体方向如下：

- `public/` - 应用主页资源文件
- `src/` - 工作区
  - `commom/` - 公共文件
    - `bizComps` 业务组件--特定业务功能模块可以复用的组件
    - `components` 子项目通用组件
    - `tools` 子项目工具类
  - `pages/` - 页面文件
    - `template/` - 页面模板
    - `xxx/` -xxx页面资源文件夹
      - `index.tsx/` - xxx页面主页
      - `xxx.less/` -  xxx页面样式文件
      - `xxx.ts/` - xxx页面与状态无关的方法文件
      - `xxx.test.js/` - xxx页面测试文件
  - `mock/` - 模拟数据
    - `index.js/` - 模拟数据导入汇总文件
    - `xxx.js/` - xxx类型的模拟数据
  - `routes/` - 路由文件
    - `IconComp/` - 动态加载图标
    - `index.ts/` - 路由配置
- `app.tsx` - 子工程入口文件
- `index.tsx` - 子工程挂载渲染入口
- `tsconfig.json` - typescript 的配置
- `package.json` - 子工程 package json 配置
- `README.md` - 子工程说明文档
- `tsconfig.json` - typescript 的配置

-----

### 启动「生产工具」

```shell
yarn start:auth
```

## 测试

通过 jest 测试，测试文件放在对应页面文件下。然后在子项目根目录执行 `yarn test` 即可进行测试。

-----

## 部署

通过jenkins部署,链接和账号是：
http://192.168.14.101:8080/login?from=%2Fview%2F%2520frontend-project%2Fjob%2Fcustom-platform-v3-frontend_SQ_SCAN%2Fjob%2Ffeat-20200707-authInit%2F4%2Fconsole

hydev/123456

-----

## 最后

有问题私聊wph
