import { WidgetMetadata } from "@engine/visual-editor/data-structure";

export const FormButtonMeta: WidgetMetadata = {
  id: 'widget-form-button',
  editableProps: {
    title: {
      type: 'string'
    }
  },
  widgetDef: {
    type: 'FormButton',
  },
  label: '动作按钮',
  bindPropItems: {
    propItemRefs: [
      { propID: 'prop_title_value', defaultValues: { title: '提交' } },
      { propID: 'prop_action_config' },
    ]
  }
};
