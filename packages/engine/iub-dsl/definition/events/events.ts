// TODO: 是否需要区分不同的widget

/**
 * 1. 通过某种结构在解析的时候区分是否为静态
 * 2. 针对不同的类型进行采用不同增强器解析/运行
 * 3. UI接入的时候将统一的props, 转换成为真实组件使用的props
 */

/** 直接引用 action */
export type ActionDirectType = {
  type: "direct";
  func: "Action";
};

/** 从 action collection 中引用 action */
export type ActionRefType = {
  type: "actionRef";
  /** 引用的页面，如果没有，则代表当前页 */
  pageID?: string;
  /** 需要引用的组件 ID */
  actionID: string;
}

// TODO: 有问题
export type ActionTypes = ActionDirectType | ActionRefType;

export interface WidgetEvents {
  onMount?: ActionTypes;
  onUnmount?: ActionTypes;
  /** 鼠标点击 */
  onClick?: ActionTypes;
  /** 移动端手势处罚 */
  onTap?: ActionTypes;
  /** 值改变时的回调 */
  onChange?: ActionTypes;
  /** 获取焦点时的回调 */
  onFocus?: ActionTypes;
}
