/**
 * @author zxj
 */

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

/// ///////// component /////////

/**
 * component 类型
 */
export interface ComponentElement extends ElementBasic {
  type: "component";
}

/// ///////// container /////////

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
}
