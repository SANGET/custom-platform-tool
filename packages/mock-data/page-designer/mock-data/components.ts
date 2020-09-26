import { WidgetClassDataCollection } from "@engine/visual-editor/data-structure";
import { CustomComponent } from "./custom-component-demo";
import { ApiMock } from "./api-mock";

export const componentClassCollection: WidgetClassDataCollection = {
  'component-1': {
    id: 'component-1',
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
  'container-1': {
    id: 'con1',
    widgetDef: {
      type: 'container',
      props: {
        type: 'flex', // 布局方式
        values: {
          justifyContent: 'start',
          justifyItems: 'start'
        }
      },
    },
    label: 'Flex 布局',
    bindPropItems: {
      propItemRefs: [
        { propID: 'prop_style_title_color' },
        { propID: 'prop_flex_config' },
      ]
    }
  },
  'component-table-1': {
    id: 'component-table-1',
    label: '表格',
    widgetDef: {
      type: 'Table'
    },
    bindPropItems: {
      propItemRefs: [
        { propID: 'prop_style_title_color' },
        // { propID: 'prop_flex_config' },
      ]
    }
  },
  'component-custom-1': {
    id: 'component-custom-1',
    type: 'component',
    label: '自定义组件',
    widgetDef: {
      type: 'Custom',
      render: CustomComponent
    },
    bindPropItems: {
      // propItemRefs: [
      //   'prop_style_title_color',
      //   'prop_flex_config'
      // ]
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
};

export const getCompClassDeclareData = ApiMock(componentClassCollection);
