import { WidgetMetadata } from "@engine/visual-editor/data-structure";

export const TableMeta: WidgetMetadata = {
  id: 'widget-id-3',
  label: '表格',
  widgetDef: {
    type: 'NormalTable'
  },
  bindPropItems: {
    propItemRefs: [
      { propID: 'prop_style_title_color' },
      // { propID: 'prop_flex_config' },
    ]
  }
};
