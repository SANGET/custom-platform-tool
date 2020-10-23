export const componentsCollection = {
  search_01: {
    id: "search_01",
    label: "用户名",
    type: "componentRef",
    compType: "FormInput",
    compCode: "search_01",
    placeholder: "请输入查询的用户名?",
    value: `@(schemas).search_01`,
    actions: {
      onChange: {
        type: 'actionRef',
        actionID: `@(flow).f_search_01`
      }
    }
  },
  search_02: {
    id: "search_02",
    label: "用户地址",
    type: "componentRef",
    compType: "FormInput",
    compCode: "search_02",
    placeholder: "请输入查询地址?",
    value: `@(schemas).search_02`,
    actions: {
      onChange: {
        type: 'actionRef',
        actionID: `@(flow).f_search_02`
      }
    }
  },
  search_03: {
    id: "search_03",
    label: "用户年龄",
    type: "componentRef",
    compType: "FormInput",
    compCode: "search_03",
    unit: "岁",
    placeholder: "请输入查询年龄?",
    value: `@(schemas).search_03`,
    actions: {
      onChange: {
        type: 'actionRef',
        actionID: `@(flow).f_search_03`
      }
    }
  },
  entity_02: {
    id: "entity_02",
    label: "按钮",
    type: "componentRef",
    compType: "Button",
    title: "按钮",
    text: '查表',
    actions: {
      onClick: {
        type: 'actionRef',
        actionID: `@(flow).f_entity_02`
      }
    }
  },
  entity_27: {
    id: "entity_27",
    label: "表格",
    type: "componentRef",
    compType: "NormalTable",
    title: "文本框",
    columns: [
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '用户地址',
        dataIndex: 'address',
        key: 'address',
      },
    ],
    dataSource: '@(schemas).entity_27'
  },
};
