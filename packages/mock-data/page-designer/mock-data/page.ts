import { PropItemConfig } from "@engine/visual-editor/data-structure";
import { ApiMock } from "./api-mock";

/**
 * TODO: 搞清楚属性如何影响组件实例，或者是说组件实例如何根据属性数据进行调整
 */
export const pagePropItems: PropItemConfig[] = [
  (entity) => {
    return {
      id: 'prop_style_title_color',
      label: '背景颜色',
      /**
       * 用于定位属性类型
       */
      type: 'style',
      target: 'backgroundColor',
      component: {
        type: 'Input'
      }
    };
  },
];

export const getPagePropItems = ApiMock(pagePropItems);
