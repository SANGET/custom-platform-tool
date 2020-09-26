import { PropItemsCollection } from "@engine/visual-editor/data-structure";
import { ApiMock } from "../api-mock";
import PropValue from './value';
import PropField from './field';

/**
 * TODO: 搞清楚属性如何影响组件实例，或者是说组件实例如何根据属性数据进行调整
 */
export const propertiesItemCollection: PropItemsCollection = {
  prop_field: PropField,
  prop_real_value: PropValue,
  prop_style_title_color: (entity) => {
    return {
      id: 'prop_style_title_color',
      label: '标题颜色',
      type: 'labelColor',
      propItemCompDef: {
        type: 'Input'
      }
    };
  },
  prop_title_value: (entity) => {
    const { label = '标题' } = entity;
    return {
      id: 'prop_title_value',
      label: '标题',
      type: 'title',
      defaultValue: label,
      propItemCompDef: {
        type: 'Input',
      }
    };
  },
  prop_flex_config: (entity) => {
    return {
      id: 'prop_flex_config',
      label: '列数量',
      type: 'columnCount',
      propItemCompDef: {
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
