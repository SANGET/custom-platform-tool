type DefaultScheamsType = "string" | "num" | "any" | "boolean";

export interface FieldRef {
  type: DefaultScheamsType;
  // 元数据到数据模型的字段映射
  fieldMapping: string;
  rules?: string | object;
  defaultVal?: string; // 默认值
  selectData?: any;
}
export interface StructRef {
  type: "array" | "object";
  struct: {
    [key: string]: FieldRef; // DefaultScheamsType
  }
}

interface DefaultSchemas {
  [variable: string]: StructRef; // DefaultScheamsType
}

export default DefaultSchemas;
