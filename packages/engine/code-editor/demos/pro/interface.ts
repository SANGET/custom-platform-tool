import { EventDataNode, DataNode } from "antd/lib/tree";

interface IExpandNode {
  name?: string
  description?: string
}
export interface ITreeNodeInfo {
  event: 'select';
  selected: boolean;
  node: EventDataNode & IExpandNode;
  selectedNodes: DataNode[];
  nativeEvent: MouseEvent;
}
export interface IBaseOption {
  key: string;
  value: string;
}

export interface IParams {
  key?: string;
  name?: string;
  value?: string | [] | object | number;
  type?: string;
  index?: number;
}
