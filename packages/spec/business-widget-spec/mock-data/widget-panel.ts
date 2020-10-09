import { GroupPanelData } from "@engine/visual-editor/components/GroupPanel";
import { ApiMock } from "./api-mock";

export const widgetPanelData: GroupPanelData = {
  title: '控件类型',
  type: 'dragableItems',
  itemsGroups: [
    {
      title: '表单控件',
      items: [
        'widget-id-1',
        'widget-id-5',
      ]
    },
    {
      title: '表格控件',
      items: [
        'widget-id-3',
      ]
    },
    {
      title: '布局控件',
      items: [
        'widget-id-2'
      ]
    },
  ]
};

export const getWidgetPanelData = ApiMock(widgetPanelData);
