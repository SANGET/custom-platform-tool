---
title: 低代码引擎
order: 3
group:
  path: /
nav:
  title: 设计文档
  order: 3
  path: /design
---

# 低代码引擎

## 1. 修改记录

|作者|更新日期|备注|
|---|---|---|
|胡东亮|2020-07-22|初稿|

## 2. 引言

### 2.1. 背景介绍

3.0 的业务需要处理 低代码, 表达式, 内置函数。但是代码片段不能直接运行，因此需要低代码引擎来处理解析运行。

### 2.2. 业务痛点

2.0 的表达式都是后端处理的,前端只是请求拿回返回结果。

2.0 的表达式不支持解析基本的运算操作符+、-、*、/、>、== 等

### 2.3. 低代码引擎功能

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/01.png)

### 3. 业务调用

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/04.png)

### 4. 低代码引擎框架图

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/02.png)

### 5. 低代码引擎解析的过程如下流程

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/03.png)

### 6. 接口模型

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/08.png)

### 7. 使用方式

```
codeEngine(code, options)
```

- code 代码块 (表达式, 低代码)
- options

```
{
  visitor?: Object | null; // 观察AST 节点
  es5?: boolean; // 是否转换成es5
  identifierMapping?: Object | null; // 修改AST Identifier 的值
}
```
