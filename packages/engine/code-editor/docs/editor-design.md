---
title: 低代码编辑器引擎
order: 1
group:
  path: /
nav:
  title: 设计文档
  order: 3
  path: /design
---

# 低代码编辑器引擎

----

## 1. 修改记录

|作者|更新日期|备注|
|---|---|---|
|胡东亮|2020-07-22|初稿|
|胡东亮|2020-08-19|修改文档结构|

## 2. 引言

### 2.1. 背景介绍

在页面配置过程中，对于现有工具无法配置的部分，需要支持开发人员编写代码实现。因此需要工具能支持编写代码的编辑器。

### 2.2. 业务痛点

1. 过去的 2.x 平台表达式编辑器不支持手动编辑函数，只能从列表中选取。调试功能不友好。
2. 不支持在线编辑代码。

### 2.3. 低代码编辑器引擎需要具有的能力

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/1597910242757_21E6DE06-82D3-4407-8845-8E2EF1036C6A.png)

## 3. 编写目的和范围

- 说明低代码编辑器的应用场景
- 说明低代码编辑器引擎
- 说明低代码编辑器引擎具有的功能
- 说明低代码编辑器
- 说明技术如何选型

## 4. 应用场景

![图片描述] (https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/1-Page-6.png)

低代码编辑器所需功能

![图片描述] (https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/1597908239975_CD51FCA7-673A-4CCA-9942-CC00389945EE.png)

## 5. 技术选型

经过对比和分析目前市面开源编辑器功能和扩展性分析,最终选择 CodeMirror

详细选型文档见 [文档] (/design/editor-selection)

## 6. 核心名词解释

- 低代码编辑器引擎: 可以编辑,语法提示，语法补全, 语法高亮, 自定义主题, 字体大小的代码编辑引擎模块
- JS沙箱运行器引擎架构: 可以模拟一个沙箱环境来运行代码块
- 低代码编辑器: 由低代码编辑器引擎, 低代码编辑器运行器引擎, 运行结果显示模块, 函数模块, 变量模块, 表达式模块 组合成的一个综合功能编辑器

## 7. 低代码编辑器运行过程

![图片描述] (https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/1-Page-9.png)

## 8. 低代码编辑器

![图片描述] (https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/1-Page-9-1.png)

## 9. 低代码编辑器引擎架构

![图片描述] (https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/1-Page-3.png)

## 10. 函数注册机制

![图片描述] (https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/1.png)

## 11. JS沙箱运行器引擎架构

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/1597925168600_886B3622-D3A4-4A35-96FA-9DDE5A03FCCD.png)

沙箱: 描述请查看 [js沙箱](/design/sandbox-design)

## 12. 低代码编辑器引擎API

详细接口属性见文档 [配置项](/api/editor-api)

## 13. 低代码编辑器引擎使用

具体使用见 [例子](/example/editor-example)

## 14. 低代码编辑器引擎特性

- 多语法支持
- 多主题支持
- 主题支持
- 代码补全
- 代码教程
- 自定义语法支持
