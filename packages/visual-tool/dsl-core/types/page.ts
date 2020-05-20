import {
  Selector, Input, TreeSelector, Table, Button
} from './components';

/** 元素基础描述 */
interface ElementAST {
  /** ID */
  id: string;
  /** 元素类型，不是指 html 的 tag */
  type: string;
  // /** 给元素的属性 */
  // attr?: {};
  /** 元素的生命周期 */
  lifecycle?: {
    onMount?: Function;
    onUnmount?: Function;
  };
}

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

/**
 * 容器元素
 */
interface ContainerElement extends ElementAST {
  type: 'container';
  /** 布局信息 */
  layout: FlexLayout | TableLayout;
  /** 容器内容 */
  body: (ContainerElement | ComponentElement)[];
}

/**
 * 非容器元素，行为载体组件
 */
interface ComponentElement extends ElementAST {
  type: 'component';
  /**
   * 对应的 component
   * TODO: 这里需要做所有 component 的 mapping
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
  userBehavior?: {
    /** 鼠标点击 */
    onClick?: Function;
    /** 移动端手势处罚 */
    onTap?: Function;
  };
}

/** 页面元素 */
type ElementType = ContainerElement | ComponentElement;

/** 页面内容 */
type PageContent = {
  /** 页面内容类型 */
  type: string;
  /** 子内容 */
  child: ElementType[];
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
  /** 关联的数据表 */
  dataSource: GeneralTableMapping | SearchingTableMapping;

  /** 页面内容 */
  content: PageContent;
}
