/**
 * 元素基础描述
 */
export interface ElementBasic {
  /** ID */
  id: string
  /** 元素类型，不是指 html 的 tag */
  type: string
  /** style */
  style?: React.CSSProperties
}

/**
 * 从 component collection 中引用组件
 */
export type ComponentElementRefType = {
  id: string;
  type: "componentRef";
  /** 引用的页面，如果没有，则代表当前页 */
  pageID?: string;
  /** 需要引用的组件 ID */
  componentID: string;
};

/** flex 布局 */
interface FlexLayout {
  type: "flex";
  props: {
    /** TODO: 填充完整 */
    justifyItems?: "start" | "end";
    justifyContent?: "start" | "end";
    visibility?: boolean;
  };
}

/** table 布局 */
interface TableLayout {
  type: "table";
  props: {
    /** TODO: 填充完整 */
  };
}

/**
 * 容器元素
 */
export interface ContainerElement extends ElementBasic {
  type: "container";
  runtimeField?: string; // TODO: 布局绑定字段? 应该是布局和数据之间的关系
  /** 布局信息 */
  layout: FlexLayout | TableLayout;
  /** 容器内容 */
  body: (ContainerElement | ComponentElementRefType)[];
}
