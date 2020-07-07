import { ElementAST } from "./element";
import { ComponentElementRefType } from "../component/collection";

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
export interface ContainerElement extends ElementAST {
  type: "container";
  runtimeField?: string; // TODO: 布局绑定字段? 应该是布局和数据之间的关系
  /** 布局信息 */
  layout: FlexLayout | TableLayout;
  /** 容器内容 */
  body: (ContainerElement | ComponentElementRefType)[];
}
