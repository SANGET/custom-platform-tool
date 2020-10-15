import { WidgetMetadata } from "@engine/visual-editor/data-structure";
import { CustomComponent } from "../custom-component-demo";

export const CustomMeta: WidgetMetadata = {
  id: 'widget-id-4',
  label: '自定义组件',
  widgetDef: {
    type: 'Custom',
    render: CustomComponent
  },
  bindPropItems: {
    rawPropItems: [
      (entity) => {
        return {
          id: '',
          label: ''
        };
      }
    ]
  }
};
