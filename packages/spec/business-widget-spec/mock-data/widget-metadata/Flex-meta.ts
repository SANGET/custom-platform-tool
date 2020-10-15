import { WidgetMetadata } from "@engine/visual-editor/data-structure";

export const FlexMeta: WidgetMetadata = {
  id: 'con1',
  widgetDef: {
    type: '',
    // props: {
    //   type: 'flex', // 布局方式
    //   values: {
    //     justifyContent: 'start',
    //     justifyItems: 'start'
    //   }
    // },
  },
  label: 'Flex 布局',
  bindPropItems: {
    propItemRefs: [
      { propID: 'prop_style_title_color' },
      { propID: 'prop_flex_config' },
    ]
  }
};
