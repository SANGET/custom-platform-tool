# UI 组件接入标准

---

## 1. Changelog

| 作者 | 更新日期 | 版本 | 备注 |
|---|---|---|---|
| 相杰 | 2020-07-07 | v0.0.1 | 初稿 |

---

## 2. 引言

在工程开发中，我们需要使用到不同的组件。这里把组件分成两大类：

1. 基础组件，提供通用的 UI 交互能力。
2. 业务组件，根据实际业务要求，完成特定业务的组件。

以下是上述两类组件的接入标准。

---

## 3. 编写目的和范围

- 说明不同模块、类型的`组件`的接入标准

---

## 4. 通用组件

组件基于 React，以及 react 的受控于非受控组件概念，需要学习相关知识。

- 参考: [https://zh-hans.reactjs.org/](https://zh-hans.reactjs.org/)

### 4.1. UI 隔离层

我们引入了一个 UI 隔离层，主要有以下几个方面的考虑：

1. 根据实际要求，对接不同的 UI 库实现，将内部系统不依赖于某个具体的 UI 库，降低与三方库的耦合。
2. 方便根据实际需求，做组件的定制、扩展。
3. 系统实现依赖 UI 隔离层，降低三方 UI 库的更改对系统的破坏。
4. 统一所有子应用的 UI 库引用。

基于上述考虑，我们设计了一个 `UI 隔离层`：

[TODOPic]

### 4.2. 通用组件接入

在我们的工程中，需要用到`通用组件`的地方有很多，例如比较核心的`可视化编辑器引擎`，`应用平台运行容器`，`配置平台的各个管理工具`。

通用组件也是有分类的，主要分为：

1. 数据录入
   1. 输入框
   2. 选择器
2. 数据展示
   1. 表格
3. 交互响应
4. 布局组件

#### 4.2.1. 基础组件必须的接口

这里是所有由 UI 隔离层提供的组件都有的通用的属性：

```ts
interface BasicComponent {
  /// 通用属性
  /** 控制该组件的样式 */
  style: React.CSSProperties | undefined;
  /** classnames，通过内置 classnames 支持 */
  classnames: string[];
  /** 所有组件都有的包装器，可以自由控制组件外层 */
  wrapper: (child: React.ReactChild) => React.ReactChild

  /// 通用回调
  /** 组件完成 mount 后的回调 */
  onMount: () => void;
  /** 组件 unmount 后的回调 */
  onUnmount: () => void;
}
```

其余组件都需要继承并实现上述接口，对使用者提供统一标准的 UI。

#### 4.2.2. 数据录入组件

数据录入组件，主要目的是为了相应用户的输入操作，将用户操作的输入输出到系统之中。

以下是数据录入组件的必要 props：

##### 4.2.2.1. 一般数据录入组件

```ts
/**
 * 一般数据录入组件
 */
export interface FormComponent<T> extends BasicComponent {
  /// 通用属性
  /** 指定的值，如果传入了，该组件为受控组件 */
  value: any;
  /** 组件的默认值，如果只传入该属性，可不实现 onChange */
  defaultValue: any;
  /** 可以让组件被引用，提供组件实例的引用 */
  ref: React.Ref<T>;

  /// 通用回调
  /** 控件的值更改后触发的回调，如果指定了 value，则 onChange 为必填 */
  onChange: (value, preValue, event) => void;
}
```

##### 4.2.2.2. 数据录入选择器组件

```ts
/**
 * 数据录入选择器组件
 */
export interface FormSelector<T = null> extends FormComponent<T> {
  /// Input 的 props
  /** 可选的值的集合 */
  values: {
    /** 显示值 */
    text: string;
    /** 实际值 */
    value: any;
  }[]
}
```

#### 4.2.3. 数据展示组件

数据展示组件，主要目的是为了将已有数据展示给用户查看。

```ts
/**
 * 数据显示组件
 */
export interface DataDisplayComponent<T = null> extends BasicComponent {
  /// 通用属性
  /** 组件的数据来源 */
  dataSource: any;
  /** 可以让组件被引用，提供组件实例的引用 */
  ref: React.Ref<T>;
}
```

#### 4.2.4. 交互响应组件

一般处理用户的操作，以及承载其他组件的组件，例如`弹框组件`、`提示框组件` etc。

```ts
/**
 * 响应用户交互的组件，例如弹窗
 */
export interface UIResponseComponent extends BasicComponent {
  /// 通用属性
  onClose: () => void
}
```

#### 4.2.5. 布局组件

用于应用布局，参考 material ui 的布局系统：

```ts
/**
 * 布局
 */
export interface Grid {
  /** 是否为容器 */
  container: boolean;
  /** 是否为项 */
  item: boolean;
  // ...
}
```

---

## 5. 业务组件

通用的组件只能满足一般的需求，如果遇到复杂的业务场景，往往需要根据实际要求做`业务组件封装`。

常见的业务组件有：

1. 动态表格
2. 树形控件
3. etc

根据过往的经验，业务组件是基于多种`基础通用组件`的封装，输入输出也更加复杂。不过设计思路是万变不离其宗的我们同样可以规定业务组件。

---

## 6. 接入标准

我们知道了组件的类型，就开始根据组件在不同模块中的需要做组件接入工作了。

### 6.1. 例子 1 - 通用组件

判断接入的组件的类型，做必须的继承，以下以自定义 Input 为例子：

进入目录 `packages/infrastructure/ui-interface/form/`，创建 `CustomInput.tsx`：

```ts
interface CustomInputComponent extends FormComponent {

}

export const CustomInput = (props: CustomInputComponent) => {
  return (
    /// ...
  )
}
```

在 `form/index.ts` 中注册：

```ts
...

export * from './CustomInput';
```

其他外部模块便可引用。

### 6.2. 例子 2 - 可视化编辑器引擎组件接入

对应的是`设计器组件接入标准`。

在`可视化编辑器引擎`项目中，声明需要用到的组件，由 UI 隔离层统一提供。`可视化编辑器引擎`中也可以在自定义专属于自身的`可视化编辑器业务组件`。

这里我们以`可视化编辑器业务组件`举例子：

进入 `packages/engine/visual-editor/components/`，创建 `TestComponent.tsx`，判断该组件是什么类型的组件，假设是一个选择器：

```ts
/// TestComponent.tsx

interface TestComponentProps extends Selector {
  /// ...自定义 props
}

const TestComponent = (props: TestComponentProps) => {
  return (
    /// ...
  )
}

const App = () => {
  return (
    <TestComponent {...props} />
  )
}
```

---

## 7. 检查

最后一步，我们需要检查接入的 UI 是否符合规范，所以我们需要通过`UI 规范测试`来检验接入的 UI。以下我们以 `jest` 为例子，检查`属性面板 UI 接入`：

```ts
import InputForPropEditorPanel from './path-to-com';

describe('测试属性面板 UI 接入', () => {
  test('输入组件', () => {
    const params = {};
    const expectRes = () => {
      return {
        label: string,
        type: 'componentCollection',
        component: {
          type: 'Input'
        }
      }
    };
    expect(InputForPropEditorPanel(params)).toBe(expectRes());
  });
})
```

执行测试：

```sh
yarn test
```

最后查看测试报告即可。
