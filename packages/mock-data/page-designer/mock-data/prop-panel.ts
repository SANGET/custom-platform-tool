import { PanelItemsGroup } from "@engine/visual-editor/components/GroupPanel";
import { ApiMock } from "./api-mock";

export const propPanelData: PanelItemsGroup[] = [
  {
    title: '属性',
    type: 'general',
    itemsGroups: [
      {
        title: '基本属性',
        items: [
          'prop_title_value',
          'prop_real_value',
        ]
      },
      {
        title: '状态属性',
        items: [
        ]
      },
      // {
      //   title: '布局控件',
      //   items: [
      //   // 'container-1'
      //   ]
      // },
    ]
  },
  {
    title: '样式',
    type: 'style',
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
    type: 'data',
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
    type: 'pageProps',
    itemsGroups: [
      {
        title: '基础控件',
        items: [
        ]
      },
    ]
  },
];

export const getPropPanelData = ApiMock(propPanelData);
