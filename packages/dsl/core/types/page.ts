import {
  Selector, Input, TreeSelector, Table, Button
} from './components';

/** flex 布局 */
interface FlexLayout {
  type: 'flex';
  props: {
    /** TODO: 填充完整 */
    justifyItems: 'start' | 'end';
    justifyContent: 'start' | 'end';
  };
}

/** table 布局 */
interface TableLayout {
  type: 'table';
  props: {
    /** TODO: 填充完整 */
  };
}

/** 是指解析器在运行的过程中产生的上下文 context */
interface ActionContext {
  type: string;
  data: {};
  expression: () => any;
  submit?: () => any;
}

/** 动作描述 */
type Action = (context: ActionContext) => any;

/** 直接引用 action */
type ActionDirectType = {
  type: 'direct';
  func: Action;
};

/** 从 action hub 中引用 action */
type ActionRefType = {
  type: 'actionRef';
  /** 引用的页面，如果没有，则代表当前页 */
  pageID?: string;
  /** 需要引用的组件 ID */
  actionID: string;
}

type ActionTypes = ActionDirectType | ActionRefType;

interface Events {
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

/** 元素基础描述 */
interface ElementAST {
  /** ID */
  id: string;
  /** 元素类型，不是指 html 的 tag */
  type: string;
  // /** 给元素的属性 */
  // attr?: {};
  /** 元素的生命周期 */
  // lifecycle?: {
  //   onMount?: ActionTypes;
  //   onUnmount?: ActionTypes;
  // };
}
/**
 * 容器元素
 */
interface ContainerElement extends ElementAST {
  type: 'container';
  /** 布局信息 */
  layout: FlexLayout | TableLayout;
  /** 容器内容 */
  body: (ContainerElement | ComponentElementRefType | ComponentElement)[];
}
/**
 * 组件元素，行为载体
 */
interface ComponentElement extends ElementAST {
  id: string;
  type: 'component';
  /**
   * 对应的 component
   * TODO: 完善所有 component 的 mapping
   */
  component: Selector | Input | TreeSelector | Table | Button;
  /** 存储通用 props 编辑后生成的数据 */
  props?: {
    /** 支持部分通用样式 */
    style?: {};
  };
  /**
   * 用户操作触发的事件
   * TODO: 完善更多事件的定义
   */
  actions?: Events;
  // actions?: {
  //   /** 鼠标点击 */
  //   onClick?: ActionTypes;
  //   /** 移动端手势处罚 */
  //   onTap?: ActionTypes;
  //   /** 值改变时的回调 */
  //   onChange?: ActionTypes;
  //   /** 获取焦点时的回调 */
  //   onFocus?: ActionTypes;
  // };
}

/** 从 component hub 中引用组件 */
type ComponentElementRefType = {
  type: 'componentRef';
  /** 引用的页面，如果没有，则代表当前页 */
  pageID?: string;
  /** 需要引用的组件 ID */
  componentID: string;
}

/** 页面元素 */
type ElementType = ContainerElement | ComponentElementRefType | ComponentElement;

/** 页面内容 */
type PageContentGeneral = {
  /** 页面内容类型 */
  type: 'general';
  /** 子内容 */
  child: ElementType[];
}

/** 页面内容 */
type PageContentCustom = {
  /** 页面内容类型 */
  type: 'custom';
  /** 子内容 */
  child: () => any;
}

/**
 * 页面类型详细定义
 */
type PageTypes =
/** 通过配置生成 */
'config' |
/** 嵌入页面 */
'embed';

/**
 * 通用的数据表
 */
interface GeneralTableMapping {
  type: 'general';
  tableName: string;
}

/**
 * 搜索规则的数据表
 */
interface SearchingTableMapping {
  type: 'searching';
  rule: string;
}

/**
 * 描述页面信息的 DSL
 *
 * 规则：一级属性存储描述页面的信息
 */
export interface PageDefination {
  /**
   * 页面 ID，用于给其他页面引用
   * TODO: 创建页面时需要获取
   */
  id: string;
  /** 页面名称 */
  name: string;
  /** 页面类型 */
  type: PageTypes;
  outputData: {
    type: '';
    value: () => any;
  };

  /** 页面布局内容边界 */
  contentHub: PageContentGeneral | PageContentCustom;

  /** 数据源关系集合 */
  dataSourceHub: GeneralTableMapping | SearchingTableMapping;

  /** 组件集合 */
  componentsHub: {
    [componentID: string]: ComponentElement;
  };

  /** 动作集合，与 component 的事件关联 */
  actionsHub: {
    [actionID: string]: Action;
  };
}
