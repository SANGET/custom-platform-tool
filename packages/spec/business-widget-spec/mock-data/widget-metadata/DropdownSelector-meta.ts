import { WidgetMetadata } from "@engine/visual-editor/data-structure";

export const DropdownSelectorMeta: WidgetMetadata = {
  id: 'widget-id-5',
  label: '下拉选择器',
  widgetDef: {
    type: 'DropdownSelector',
  },
  bindPropItems: {
    propItemRefs: [
      { propID: 'prop_style_title_color' },
      // { propID: 'prop_flex_config' },
    ]
  }
};
