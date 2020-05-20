type FieldHook = {
  before: () => {};
  after: () => {};
}

export interface BaseForm {
  /** 对应 table 的 column 的 field */
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
  type: 'Selector';
}

export interface Input extends BaseForm {
  type: 'Input';
  expression?: (expressionInput: string) => any;
}

export interface TreeSelector extends BaseForm {
  type: 'TreeSelector';
  dataSource: {
    tableName: string;
  };
}

export interface Table {
  type: 'Table';
  dataSource: {};
}

export interface Button {
  type: 'Button';
  text: string;
}
