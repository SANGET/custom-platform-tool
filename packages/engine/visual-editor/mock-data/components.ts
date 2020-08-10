import { EditorComponentClass } from "../types";

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
};
