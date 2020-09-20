import { PanelItemsGroup } from "@engine/visual-editor/components/GroupPanel";
import { ApiMock } from "./api-mock";

export const compClassForPanelData: PanelItemsGroup = {
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
};

export const getCompClassForPanelData = ApiMock(compClassForPanelData);
