import { PropertiesItemCollection } from "../property/props-item";

export const propertiesItemCollection: PropertiesItemCollection = {
  'propID-1': (entity) => {
    return {
      label: '输入1',
      type: 'componentCollection.',
      component: {
        type: 'Input'
      }
    };
  },
  'propID-2': {
    label: '输入2',
    component: {
      type: 'Input'
    }
  },
  'propID-3': {
    label: '输入3',
    component: {
      type: 'Input'
    }
  },
  'propID-4': {
    label: '输入4',
    component: {
      type: 'Input'
    }
  },
  'propID-5': {
    label: '输入5',
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
