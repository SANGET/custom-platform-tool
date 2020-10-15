---
title: js沙箱
order: 3
group:
  path: /
nav:
  title: 设计文档
  order: 3
  path: /design
---

## 什么是沙箱 (Sandbox)

沙箱，即sandbox，顾名思义，就是让你的程序跑在一个隔离的环境下，不对外界的其他程序造成影响，也不会被外界其他程序影响。

举个简单的栗子，其实我们的浏览器，Chrome 中的每一个标签页都是一个沙箱（sandbox）。渲染进程被沙箱（Sandbox）隔离，网页 web 代码内容必须通过 IPC 通道才能与浏览器内核进程通信，通信过程会进行安全的检查。沙箱设计的目的是为了让不可信的代码运行在一定的环境中，从而限制这些代码访问隔离区之外的资源。

## 开始前需要知识

- ### eval

eval()是一个危险的函数， 它使用与调用者相同的权限执行代码。如果你用 eval() 运行的字符串代码被恶意方（不怀好意的人）修改，您最终可能会在您的网页/扩展程序的权限下，在用户计算机上运行恶意代码。更重要的是，第三方代码可以看到某一个 eval() 被调用时的作用域，这也有可能导致一些不同方式的攻击。改方法通常比其他替代方法更慢，因为它必须调用 JS 解释器，而许多其他结构则可被现代 JS 引擎进行优化。

具体介绍和使用查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)

- ### Function

Function 构造函数创建一个新的 Function 对象。直接调用此构造函数可用动态创建函数，Function 创建的函数只能在全局作用域中运行。

具体介绍和使用查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)

- ### with

with语句 扩展一个语句的作用域链。

具体介绍和使用查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with)

- ### Symbol

具体介绍和使用查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

## 简单的沙盒实现

```
fn = new Function(...args, code);
```

通过new Function 可以实现一个简单的沙盒,但是考虑到作用域的影响。我们可以稍微改造下上面的例子

```
function compileCode(code) {
  code = `with (sandbox) {${code}}`
  return new Function('sandbox', code)
}
```

通过with 我们可以阻止程序直接访问上一级作用域,先访问 sandbox 中变量，如果sandbox不存在,才会向上查找 global对象,虽然有了一道防火墙，但依然不能阻止fn访问全局作用域。
那么如何解决code逃逸沙箱的问题,其实有些人可能会想到代理能否解决这个问题，答案是可以的，我们可以使用es6 `Proxy`属性。

```
function compileCode(code) {
  code = `with (sandbox) {${code}}`
  var fn = new Function('sandbox', code)
  return (sandbox) => {
    var proxy = new Proxy(sandbox, {
      has(target, key) {
        return true
      }
    });
    return fn(proxy)
  }
}
```
上面的代码是不是是完美解决了我们的问题了吗?还可以优化吗? 答案是肯定的,这时我们可以使用`Symbol.unscopables`来处理

```
function compileCode(code) {
  code = 'with (sandbox) {' + code + '}';
  const fn = new Function('sandbox', code);
  return (sandbox) => {
    const proxy = new Proxy(sandbox, {
      has(target, key) {
        return true
      }
      get(target, key, receiver) {
        if (key === Symbol.unscopables) {
          return undefined
        }
        Reflect.get(target, key, receiver);
      }
    });
    return fn(proxy);
  }
}
```

以上只是一个简单的沙箱代码块，具体例子请前往 [例子](/example/sandbox-example)

## 实现原理

![图片描述](https://cdn.jsdelivr.net/gh/18613109040/editor/public/images/tapd_41909965_1597282320_53.png)
