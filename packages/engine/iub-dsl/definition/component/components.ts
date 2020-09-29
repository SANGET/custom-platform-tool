type FieldHook = {
  before: () => {};
  after: () => {};
};

export enum AllComponentType {
  FormInput = "FormInput",
  Selector = "Selector",
  TreeSelector = "TreeSelector",
  NormalTable = "NormalTable",
  Button = "Button",
  Error = "Error"
}

export interface BaseForm {
  key: string;
  /** 对应schemas的store */
  field: string;
  /** 对应 table column 的 field 在异步操作时的 hook */
  fieldHook?: FieldHook;
  /** 显示标题 */
  label?: string;
  /** 是否必填|选 */
  required?: boolean;
  /** 该 form control 的描述 */
  desc?: string;
}

export interface Selector extends BaseForm {
  type: AllComponentType.Selector;
  /** 对应schemas的store, stroe必须是∂ */
  dataSource: any[];
}

export interface FormInput extends BaseForm {
  type: AllComponentType.FormInput;
}

export interface TreeSelector extends BaseForm {
  type: AllComponentType.TreeSelector;
  dataSource: {
    tableName: string;
  };
}

export interface Table {
  key: string;
  type: AllComponentType.NormalTable;
  dataSource: {};
}

export interface Button {
  key: string;
  type: AllComponentType.Button;
  text: string;
}
