import { EditorPropertyCollection } from "../types";

export const propertiesItemCollection: EditorPropertyCollection = {
  'propID-1': (entity) => {
    return {
      label: '输入1',
      /**
       * 用于定位属性类型
       */
      type: 'componentCollection',
      component: {
        type: 'Input'
      }
    };
  },
  'propID-2': {
    label: '输入2',
    type: 'componentCollection',
    component: {
      type: 'Input'
    }
  },
  'propID-3': {
    label: '输入3',
    type: 'componentCollection',
    component: {
      type: 'Input'
    }
  },
  'propID-4': {
    label: '输入4',
    type: 'componentCollection',
    component: {
      type: 'Input'
    }
  },
  'propID-5': {
    label: '输入5',
    type: 'componentCollection',
    component: {
      type: 'Input'
    }
  },
};

export const getPropertyItems = () => {
  return new Promise((resolve) => {
    resolve(propertiesItemCollection);
  });
};
