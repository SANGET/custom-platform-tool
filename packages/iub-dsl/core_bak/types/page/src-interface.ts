import Expression from "../actions/expression";

type FieldType = "string" | "int";

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

const contextA = {
  var1: 1,
  var2: 2,
  var3: 3,
};
const contextM = {
  var1: 1,
  var2: 2,
  var3: 3,
};
