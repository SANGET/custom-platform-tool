import { EditorComponentClass } from "@engine/visual-editor/types";
import { CustomComponent } from "./custom-component-demo";
import { ApiMock } from "./api-mock";

interface ComponentClassCollection {
  [id: string]: EditorComponentClass
}

export const componentClassCollection: ComponentClassCollection = {
  'component-1': {
    id: 'component-1',
    label: '文本框',
    component: {
      type: 'Input'
    },
    bindProps: {
      propRefs: [
        { propID: 'prop_style_title_color' },
        { propID: 'prop_title_value', override: { defaultValue: '文本框' } },
        { propID: 'prop_real_value' },
        { propID: 'prop_field' },
      ]
    }
  },
  'container-1': {
    id: 'con1',
    component: {
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
    bindProps: {
      propRefs: [
        { propID: 'prop_style_title_color' },
        { propID: 'prop_flex_config' },
      ]
    }
  },
  'component-table-1': {
    id: 'component-table-1',
    label: '表格',
    component: {
      type: 'Table'
    },
    bindProps: {
      propRefs: [
        { propID: 'prop_style_title_color' },
        // { propID: 'prop_flex_config' },
      ]
    }
  },
  'component-custom-1': {
    id: 'component-custom-1',
    type: 'component',
    label: '自定义组件',
    component: {
      type: 'Custom',
      render: CustomComponent
    },
    bindProps: {
      // propRefs: [
      //   'prop_style_title_color',
      //   'prop_flex_config'
      // ]
      rawProp: [
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
