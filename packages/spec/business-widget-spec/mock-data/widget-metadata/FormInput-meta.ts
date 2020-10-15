import { WidgetMetadata } from "@engine/visual-editor/data-structure";

export const FormInputMeta: WidgetMetadata = {
  id: 'widget-id-1',
  label: '文本框',
  widgetDef: {
    type: 'FormInput'
  },
  editableProps: {
    title: {
      type: 'string'
    },
    titleColor: {
      type: 'string'
    },
    defValue: {
      type: 'any'
    },
    field: {
      type: 'struct'
    },
  },
  bindPropItems: {
    propItemRefs: [
      { propID: 'prop_style_title_color', editAttr: ['labelColor'] },
      { propID: 'prop_title_value', override: { defaultValue: '文本框' }, editAttr: ['title'] },
      { propID: 'prop_real_value', editAttr: ['defValue', 'exp', 'variable'] },
      { propID: 'prop_field', editAttr: ['field'] },
    ]
  }
};
