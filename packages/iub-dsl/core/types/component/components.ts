type FieldHook = {
  before: () => {};
  after: () => {};
};

export interface BaseForm {
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
  type: "Selector";
  /** 对应schemas的store, stroe必须是∂ */
  dataSource: string;
}

export interface Input extends BaseForm {
  type: "Input";
}

export interface TreeSelector extends BaseForm {
  type: "TreeSelector";
  dataSource: {
    tableName: string;
  };
}

export interface Table {
  type: "Table";
  dataSource: {};
}

export interface Button {
  type: "Button";
  text: string;
}
