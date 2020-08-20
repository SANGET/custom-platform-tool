import { EditorPropertyItemsCollection } from "../types";

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
  'prop-label-1': (entity) => {
    // console.log(entity);
    const { label = '标题' } = entity;
    return {
      id: 'prop-label-1',
      label: '标题',
      /**
       * 用于定位属性类型
       */
      type: 'general',
      target: 'label',
      defaultValue: label,
      component: {
        type: 'Input',
      }
    };
  },
  'prop-flex-config-1': (entity) => {
    return {
      id: 'prop-flex-config-1',
      label: '列数量',
      /**
       * 用于定位属性类型
       */
      type: 'style',
      target: 'color',
      component: {
        type: 'Selector',
        defaultValue: 1,
        values: [{
          text: 1,
          value: 1
        }, {
          text: 2,
          value: 2
        }, {
          text: 3,
          value: 3
        }, {
          text: 4,
          value: 4
        }]
      }
    };
  },
};

export const getPropertyItems = () => {
  return new Promise((resolve) => {
    resolve(propertiesItemCollection);
  });
};
