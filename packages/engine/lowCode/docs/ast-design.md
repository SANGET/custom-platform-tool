---
title: AST
order: 4
group:
  path: /
nav:
  title: 设计文档
  order: 3
  path: /design
---

# 抽象语法树

## 什么是抽象语法树

抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。之所以说语法是“抽象”的，是因为这里的语法并不会表示出真实语法中出现的每个细节。

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/07.png)

[在线AST转换工具](https://astexplorer.net/)

## AST的使用场景

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
  - 如JSLint、JSHint对代码错误或风格的检查，发现一些潜在的错误
  - IDE的错误提示、格式化、高亮、自动补全等等

- 代码混淆压缩
  - UglifyJS2等

- 优化变更代码，改变代码结构使达到想要的结构
  - 代码打包工具webpack、rollup等等
  - CommonJS、AMD、CMD、UMD等代码规范之间的转化
  - CoffeeScript、TypeScript、JSX等转化为原生Javascript


## 解析过程

### 分词

将整个代码字符串分割成语法单元数组

Js中语法单元包括:

- 关键字：const、let、var等
- 标识符：可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些常量
- 运算符
- 数字
- 空格
- 注释

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/05.png)

### 语法分析

建立分析语法单元之间的关系(简单来说语法分析是对语句和表达式识别)

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/06.png)

## 表达式

```
单价 * 数量
```

转换成AST结构

```
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "BinaryExpression",
        "left": {
          "type": "Identifier",
          "name": "单价"
        },
        "operator": "*",
        "right": {
          "type": "Identifier",
          "name": "数量"
        }
      }
    }
  ],
  "sourceType": "module"
}
```

如果我们需要将 [单价] 替换成对应的变量 ，我们发现此结构就非常简单只需把类型为 Identifier 对应的name 修改成你要的变量即可
