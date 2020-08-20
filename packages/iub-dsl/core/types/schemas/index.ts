// import DefaultSchemas from "./default-schemas";
// import PageSchemas from "./page-schemas";
// import FlowSchemas from "./flow-schemas";

type StructType = 'structArray' | 'structObject'
type FoundationType = 'num' | 'string' | 'boolean'

interface Rule {
  require?: boolean;
  minLength?: string;
  maxLength?: string;
  [rule: string]: unknown;
}

interface BaseScheams {
  rules?: Rule[]; // 规则也应该是属于关系的扩展来的,因为他是有多方的依赖
  defaultVal?: string | number | boolean; // 默认值
  // group?: string[]; // 是关系使用模型仓库,关系依赖他.. 所以放在关系上扩展
  inputDataWeight?: unknown[]; // 多个来源的值共同作用于同一个模型

  alias?: string; // 别名描述 // TODO: 以后会修改的
}

export interface FoundationTypeSchemas extends BaseScheams {
  type: FoundationType
  // TODO: 存疑关系型数据库,对应的是基础类型的,有结构的数据类型应该没有fieldMapping
  fieldMapping?: string; // 元数据到数据模型的字段映射
}

export interface StructTypeSchemas extends BaseScheams {
  type: StructType;
  struct: {
    [UUID: string]: FoundationTypeSchemas | StructTypeSchemas
  }
}

export type SchemaItem = FoundationTypeSchemas | StructTypeSchemas

export interface Schemas {
  [dataUUID: string]: SchemaItem;
}

// export { DefaultSchemas, FlowSchemas, PageSchemas };
