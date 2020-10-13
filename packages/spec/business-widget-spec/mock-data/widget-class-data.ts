import { WidgetTypeMetadataCollection } from "@engine/visual-editor/data-structure";
import { CustomComponent } from "./custom-component-demo";
import { ApiMock } from "./api-mock";

export const widgetClassDataCollection: WidgetTypeMetadataCollection = {
  'widget-id-1': {
    id: 'widget-id-1',
    label: '文本框',
    widgetDef: {
      type: 'FormInput'
    },
    bindPropItems: {
      propItemRefs: [
        { propID: 'prop_style_title_color' },
        { propID: 'prop_title_value', override: { defaultValue: '文本框' } },
        { propID: 'prop_real_value' },
        { propID: 'prop_field' },
      ]
    }
  },
  'widget-id-2': {
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
  },
  'widget-id-3': {
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
  },
  'widget-id-4': {
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
  },
  'widget-id-5': {
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
  },
};

export const getWidgetDefinitionData = ApiMock(widgetClassDataCollection);
