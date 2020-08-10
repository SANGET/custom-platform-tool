/**
 * @author zxj
 */

/**
 * 用于记录布局节点信息的数据结构
 */
export interface LayoutNodeInfo {
  /** id */
  id: string;
  /** 节点类型 */
  type: "container" | 'component';
  /** 引用的元素 ID */
  elemRefID: string;
  /** 子布局内容 */
  body: LayoutNodeInfo[]
}
