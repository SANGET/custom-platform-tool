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
  exposeVar?: PageVariable;
  refVar?: PageVariable;
  // TODO: 多个、单个？不同情况输入/输出不同的数据结构。？
  output?: TransmissionValueRef;
  input?: TransmissionValueRef;
}

export default PageInterface;
