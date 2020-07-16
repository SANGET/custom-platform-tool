/**
 * 基础的组件
 */
export interface BasicComponent {
  /// 通用属性
  /** 控制该组件的样式 */
  style?: React.CSSProperties | undefined;
  /** className */
  className?: string;
  /** classnames，通过内置 classnames 支持 */
  classnames?: string[];
  /** 所有组件都有的包装器，可以自由控制组件外层 */
  wrapper?: (child: React.ReactChild) => JSX.Element

  /// 通用回调
  /** 组件完成 mount 后的回调 */
  onMount?: () => void;
  /** 组件 unmount 后的回调 */
  onUnmount?: () => void;
}

/**
 * 一般数据录入组件
 */
export interface FormComponent<T = null> extends BasicComponent {
  /// 通用属性
  /** 指定的值，如果传入了，该组件为受控组件 */
  value?: any;
  /** 组件的默认值，如果只传入该属性，可不实现 onChange */
  defaultValue?: any;
  /** 可以让组件被引用，提供组件实例的引用 */
  ref?: React.Ref<T>;

  /// 通用回调
  /** 控件的值更改后触发的回调，如果指定了 value，则 onChange 为必填 */
  onChange?: (value, preValue, event) => void;
}

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

/**
 * 数据显示组件
 */
export interface DataDisplayComponent<T = null> extends BasicComponent {
  /// 通用属性
  /** 组件的数据来源 */
  dataSource: any;
  /** 可以让组件被引用，提供组件实例的引用 */
  ref?: React.Ref<T>;
}

/**
 * 响应用户交互的组件，例如弹窗
 */
export interface FeedbackComponent extends BasicComponent {
  /// 通用属性
  onClose?: () => void
}
