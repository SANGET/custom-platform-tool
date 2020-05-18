# React 前端工程脚手架

[![Build Status](https://travis-ci.org/SANGET/react-app-seed.svg?branch=master)](https://travis-ci.org/SANGET/react-app-seed)

支持

- Typescript
- SCSS
- ESLint

## 使用

```shell
git clone https://github.com/SANGET/react-app-seed.git
cd ./react-app-seed
yarn; yarn start
```

## 约定

### 文档编写

使用 `vscode` 编写 `Markdown` 或者 `typora`

vscode markdown 插件

- markdown all in one // 便于编写 Markdown
- markdownlint        // 便于检查 Markdown 是否符合预期格式

### 开发工具

vscode

### 注解

JSDoc 风格

```js
/**
 * 说明
 *
 * @param {object} params 说明
 * @returns {boolean} 说明
 */
function forDocument(params = {}) {
  return true;
}
```

或者 ts 的注解

```ts
interface Params {
  /** 参数类型 */
  type: string;
}
function forDocument(params: Params) {
  return true;
}
```

### Eslint

> 基于 Airbnb 的编码规范，非强制性，使用编辑器的提示功能

1. vscode 安装 eslint 插件
2. 添加 .eslintrc 文件
3. 添加 .tsconfig.json

### 文档生成工具

- JSDoc3
- Docz
- React Styleguide
- StoryBook

### 测试与持续集成

- 根据实际情况使用测试库，目前使用 jest
- 可以根据项目的性质和实际的情况操作，此仓库使用 travis 和 netlify

## 依赖

- [@mini-code/base-func](https://github.com/SANGET/@mini-code/base-func-js.git)
- [@deer-ui/core](https://github.com/ukelli/@deer-ui/core.git)
- [@mini-code/request](https://github.com/SANGET/@mini-code/request.git)
<!-- - [uke-dashboard](https://github.com/SANGET/uke-dashboard.git)
- [uke-admin-web-scaffold](https://github.com/SANGET/uke-admin-web-scaffold.git)
- [uke-cli](https://github.com/SANGET/uke-cli.git)
- [uke-scripts](https://github.com/SANGET/uke-scripts.git) -->
