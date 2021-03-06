import { GroupPanelData } from "@engine/visual-editor/components/GroupPanel";
import { ApiMock } from "./api-mock";

export const propItemGroupingData: GroupPanelData[] = [
  {
    title: '属性',
    itemsGroups: [
      {
        title: '基本属性',
        items: [
          'prop_widget_coding',
          'prop_title_value',
          'prop_field',
          'prop_real_value',
          'prop_action_config',
        ]
      },
      {
        title: '状态属性',
        items: [
        ]
      },
    ]
  },
  {
    title: '样式',
    itemsGroups: [
      {
        title: '样式属性',
        items: [
          'prop_style_title_color',
        ]
      },
    ]
  },
  {
    title: '数据',
    itemsGroups: [
      {
        title: '控件校验',
        items: [
        ]
      },
    ]
  },
  {
    title: '页面属性',
    itemsGroups: [
      {
        title: '基础控件',
        items: [
        ]
      },
    ]
  },
];

export const getPropItemGroupingData = ApiMock(propItemGroupingData);
