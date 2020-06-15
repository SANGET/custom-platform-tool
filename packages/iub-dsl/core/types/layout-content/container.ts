import { ElementAST } from "./element";
import { ComponentElementRefType } from "../component/collection";

/** flex 布局 */
interface FlexLayout {
  type: 'flex';
  props: {
    /** TODO: 填充完整 */
    justifyItems?: 'start' | 'end';
    justifyContent?: 'start' | 'end';
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
export interface ContainerElement extends ElementAST {
  type: 'container';
  /** 布局信息 */
  layout: FlexLayout | TableLayout;
  /** 容器内容 */
  body: (ContainerElement | ComponentElementRefType)[];
}
