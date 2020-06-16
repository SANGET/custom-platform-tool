type DefaultScheamsType = "string" | "num" | "any" | "boolean";

interface FieldRef {
  type: DefaultScheamsType;
  rules?: string | object;
  defaultVal?: string; // 默认值

  // ??
  mapping: string;
  selectData?: any;
}
interface StructRef {
  type: "array" | "object";
  struct: {
    [key: string]: DefaultScheamsType | string | FieldRef;
  };
}

interface DefaultSchemas {
  [variable: string]: DefaultScheamsType | StructRef;
}

export default DefaultSchemas;
