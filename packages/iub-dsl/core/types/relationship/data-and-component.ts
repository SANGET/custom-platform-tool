import { CommonObjStruct } from "../public";

// TODO: 流程控制? 没有流程控制, 一类的数据变化作用于一个或者多个组件的属性/样式
interface DataAndComponent{
  // TODO: style/props 的变化是通用的应该是通用的interface
  style: React.CSSProperties;
  props: CommonObjStruct;
  datas: [],
  actsComponent: string[]; // 一组组件
}

export default DataAndComponent;

// TODO: 再想清楚一点, 这个有问题的
interface VaildFeedback {
  extraActsComponent: string[];
  errorText: string;
}

interface Rule extends VaildFeedback {
  require?: boolean;
  minLength?: string;
  maxLength?: string;
  [rule: string]: unknown;
}

interface DataVaild {
  validRule: Rule[]

}

// 一般来讲一个schemas字段只会对应一个组件只会有一个校验规则 TODO: 反例
interface DataVaildRelation {
  [dataUUID: string] : DataVaild
}
