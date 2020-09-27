# 自定义工具 3.0 前端 web 服务

## 技术选型

- nestjs
- typescript
- typeORM
- sqlite

## Description

为了更好的对接后端，以及为打通`配置端`->`应用端`的 web 核心链路支持，需要构建一个 web 服务，核心能力有：

1. 配置端的动态资源管理（二期规划规划）
2. 支撑应用端的数据获取
   1. 将配置端产出的页面数据转换为 IUB-DSL（一期工程）
   2. 将 IUB-DSL 写为静态资源文件（二期工程规划）
   3. 将应用端的前端部署静态化（三期工程规划）

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
