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
  exposeVar: {
    /** uuid: variable */
    [uuid: string]: string;
  };
  refVar: Expression[];
  output: {
    type: string;
    getStruct: {
      [variable: string]: FieldType;
    };
  };
  input: {};
}

export default PageInterface;
