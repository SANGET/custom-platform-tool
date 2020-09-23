import Expression from "../actions/expression";

type FieldType = "string" | "int" | "num";

interface PageVariable {
  /** uuid: variable */
  [uuid: string]: string;
}

interface TransmissionValueRef {
  type: string;
  struct: {
    [variable: string]: FieldType;
  };
}

interface PageInterface {
  exposeVar?: {
    /** uuid: variable */
    [uuid: string]: string;
  };
  refVar?: Expression[];
  /**
   * 输出范围, 本页面所有的页面变量,
   * 应该是统一的又描述元数据又描述结构的数据
   * 在配置的时候应该会有对应的页面变量支持定位和使用~~!!
  */
  output?: {
    type: string;
    getStruct: {
      [variable: string]: FieldType;
    };
  };
  /**
   * 输入也是同理, 结构需要定义好!
   */
  input?: {};
}

export default PageInterface;
