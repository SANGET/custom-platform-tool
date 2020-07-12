import { EditorPropertyItemsCollection } from "../../types";

/**
 * TODO: 搞清楚属性如何影响组件实例，或者是说组件实例如何根据属性数据进行调整
 */
export const propertiesItemCollection: EditorPropertyItemsCollection = {
  'prop-style-1': (entity) => {
    return {
      id: 'prop-style-1',
      label: '标题颜色',
      /**
       * 用于定位属性类型
       */
      type: 'style',
      target: 'color',
      component: {
        type: 'Input'
      }
    };
  },
};

export const getPropertyItems = () => {
  return new Promise((resolve) => {
    resolve(propertiesItemCollection);
  });
};
