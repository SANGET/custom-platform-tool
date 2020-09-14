import { ApiMock } from "./api-mock";

export const compPanelData = {
  tabGroup: [
    {
      title: '控件类型',
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
    {
      title: '数据源',
      itemsGroups: [
        {
          title: '基础控件',
          items: [
            'component-1',
            'component-table-1',
          ]
        },
      ]
    },
    {
      title: '控件模版',
      itemsGroups: [
        {
          title: '基础控件',
          items: [
            'component-1',
            'component-table-1',
          ]
        },
      ]
    },
  ]
};

export const getCompPanelData = ApiMock(compPanelData);
