import { EditorComponentClass } from "../types";
import { CustomComponent } from "./custom-component-demo";

interface ComponentClassCollection {
  [id: string]: EditorComponentClass
}

export const componentClassCollection: ComponentClassCollection = {
  'component-1': {
    id: 'component-1',
    type: 'component',
    label: '文本框',
    component: {
      type: 'Input'
    },
    bindProperties: {
      propRefs: [
        'prop-style-1',
        'prop-label-1'
      ]
    }
  },
  'container-1': {
    id: 'con1',
    type: 'container',
    layout: {
      type: 'flex', // 布局方式
      props: {
        justifyContent: 'start',
        justifyItems: 'start'
      }
    },
    label: 'Flex 布局',
    bindProperties: {
      propRefs: [
        'prop-style-1',
        'prop-flex-config-1'
      ]
    }
  },
  'component-table-1': {
    id: 'component-table-1',
    type: 'component',
    label: '表格',
    component: {
      type: 'Table'
    },
    bindProperties: {
      propRefs: [
        'prop-style-1',
        'prop-flex-config-1'
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
    bindProperties: {
      // propRefs: [
      //   'prop-style-1',
      //   'prop-flex-config-1'
      // ]
      rawProp: [
        (entity) => {
          return {};
        }
      ]
    }
  },
};
