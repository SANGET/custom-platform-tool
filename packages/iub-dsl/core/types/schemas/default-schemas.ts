type DefaultScheamsType = 'string' | 'num' | 'any' | 'boolean'

interface FieldRef {
  type: DefaultScheamsType;
  // 元数据到数据模型的字段映射
  fieldMapping: string;
  rules?: string | object;
  defaultVal?: string; // 默认值
  selectData?: any;
}
interface StructRef {
  type: 'array' | 'object';
  struct: {
    [key: string]: DefaultScheamsType | FieldRef;
  }
}

interface DefaultSchemas {
  [variable: string]: DefaultScheamsType | StructRef ;
}

export default DefaultSchemas;