// import DefaultSchemas from "./default-schemas";
// import PageSchemas from "./page-schemas";
// import FlowSchemas from "./flow-schemas";

export type StructType = 'structArray' | 'structObject'
export type FoundationType = 'number' | 'string' | 'boolean'

interface BaseScheams {
  // rules?: Rule[]; // 规则也应该是属于关系的扩展来的,因为他是有多方的依赖
  // group?: string[]; // 是关系使用模型仓库,关系依赖他.. 所以放在关系上扩展
  // inputDataWeight?: unknown[]; // 多个来源的值共同作用于同一个模型

  /** 默认值 */
  defaultVal?: string | number | boolean; // 默认值
  /** 别名key */
  alias?: string;
  /** 字段描述 */
  desc?: string;
  tag?: string;
  fieldTag?: string;
  compTag?: string;
}
export interface FoundationTypeSchemas extends BaseScheams {
  type: FoundationType
  /** 仅有和元数据映射有关的才有: 元数据到数据模型的字段映射 */
  fieldMapping?: string;
}

export interface ComplexTypeSchemas extends BaseScheams {
  type: StructType;
  struct: {
    [UUID: string]: SchemaItem
  }
}

export type SchemaItem = FoundationTypeSchemas | ComplexTypeSchemas

export interface Schemas {
  [dataUUID: string]: SchemaItem;
}

// export { DefaultSchemas, FlowSchemas, PageSchemas };
