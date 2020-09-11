import { EditorPropertyItemsCollection } from "@engine/visual-editor/types";
import { ApiMock } from "../api-mock";
import PropValue from './value';

/**
 * TODO: 搞清楚属性如何影响组件实例，或者是说组件实例如何根据属性数据进行调整
 */
export const propertiesItemCollection: EditorPropertyItemsCollection = {
  'prop-style-1': (entity) => {
    return {
      id: 'prop-style-1',
      label: '标题颜色',
      type: 'style',
      target: 'color',
      asd: 'AdvancedSearchForm',
      component: {
        type: 'Input'
      }
    };
  },
  'prop-label-1': (entity) => {
    const { label = '标题' } = entity;
    return {
      id: 'prop-label-1',
      label: '标题',
      type: 'general',
      target: 'label',
      defaultValue: label,
      component: {
        type: 'Input',
      }
    };
  },
  'prop-value': PropValue,
  'prop-flex-config-1': (entity) => {
    return {
      id: 'prop-flex-config-1',
      label: '列数量',
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

export const getPropItemDeclareData = ApiMock(propertiesItemCollection);
