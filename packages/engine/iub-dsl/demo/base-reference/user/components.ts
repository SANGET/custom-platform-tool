export const componentsCollection = {
  entity_25: {
    id: "entity_25",
    label: "用户名",
    type: "componentRef",
    compType: "FormInput",
    title: "文本框",
    compCode: "entity_25",
    unit: "单位25",
    placeholder: "请输入文本框内容25?",
    tipContent: `文本框内容Tip: $0`,
    value: `@(schemas).entity_25`,
    actions: {
      onChange: {
        type: 'actionRef',
        actionID: `@(actions).entity_25`
      }
    }
  },
  entity_26: {
    id: "entity_26",
    label: "用户地址",
    type: "componentRef",
    compType: "FormInput",
    title: "文本框",
    compCode: "entity_26",
    unit: "单位26",
    placeholder: "请输入文本框内容26?",
    tipContent: `文本框内容Tip: $1`,
    value: `@(schemas).entity_26`,
    actions: {
      onChange: {
        type: 'actionRef',
        actionID: `@(actions).entity_26`
      }
    }
  },
  entity_00: {
    id: "entity_00", label: "性别", type: "componentRef", compType: "Input", title: "输入框"
  },
  entity_28: {
    id: "entity_28",
    label: "用户年龄",
    type: "componentRef",
    compType: "FormInput",
    title: "文本框",
    compCode: "entity_28",
    unit: "单位2",
    placeholder: "请输入文本框内容25?",
    tipContent: `文本框内容Tip: $2`,
    value: `@(schemas).entity_28`,
    actions: {
      onChange: {
        type: 'actionRef',
        actionID: `@(actions).entity_28`
      }
    }
  },
  entity_01: {
    id: "entity_01",
    label: "按钮",
    type: "componentRef",
    compType: "Button",
    title: "按钮",
    text: '提交',
    actions: {
      onClick: {
        type: 'actionRef',
        actionID: `@(actions).entity_01`
      },
      onChange: {
        type: 'actionRef',
        actionID: `@(actions).entity_25`
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
        actionID: `@(actions).entity_02`
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
