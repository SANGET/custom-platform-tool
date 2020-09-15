import { PanelTabGroupItem } from "@engine/visual-editor/components/GroupPanel";
import { ApiMock } from "./api-mock";

export const compPanelData: PanelTabGroupItem[] = [
  {
    title: '控件类型',
    type: 'dragableItems',
    itemsGroups: [
      {
        title: '表单控件',
        items: [
          'component-1',
        ]
      },
      {
        title: '表格控件',
        items: [
          'component-table-1',
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
  // {
  //   title: '数据源',
  //   type: 'dataSource',
  //   itemsGroups: [
  //     {
  //       title: '',
  //       items: [
  //       ]
  //     },
  //   ]
  // },
  // {
  //   title: '控件模版',
  //   type: 'compTemplate',
  //   itemsGroups: [
  //     {
  //       title: '敬请期待',
  //       items: [
  //       ]
  //     },
  //   ]
  // },
];

export const getCompPanelData = ApiMock(compPanelData);
