type FieldType = 'string' | 'int'

interface PageInterface {
  output: {
    type: string;
    getStruct: {
      [variable: string]: FieldType;
    };
  };
  input: {};
}

export default PageInterface;
