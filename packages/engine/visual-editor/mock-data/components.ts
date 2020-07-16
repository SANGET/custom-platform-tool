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
    properties: {
      propRefs: ['prop-style-1']
    }
  },
  'container-1': {
    id: 'con1',
    layout: {
      type: 'flex',
    },
    label: 'Flex 布局',
    type: 'container',
    properties: {
      propRefs: ['prop-style-1']
    }
  },
};
