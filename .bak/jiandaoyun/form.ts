module.exports = {
  printList: [{
    id: "system",
    name: "系统打印"
  }],
  _id: "5eb607d911a51100060e054b",
  appId: "5eb607d911a51100060e0549",
  entryId: "5d5e535132b989071ad102a0",
  name: "订单管理",
  fields: {
    form: [{
      appId: "5eb607d911a51100060e0549",
      entryId: "5d5e5355ea400906ea1f45e0",
      name: "采购申请",
      type: "form",
      hasExtParams: false,
      extParams: [],
      icon: 23,
      fields: [{
        name: "_widget_1503368231658",
        text: "申请人",
        id: "5d5e5355ea400906ea1f45e0",
        form: "5d5e5355ea400906ea1f45e0",
        type: "user",
        visible: true
      }, {
        name: "_widget_1592533649412",
        text: "定位",
        id: "5d5e5355ea400906ea1f45e0",
        form: "5d5e5355ea400906ea1f45e0",
        type: "location",
        visible: true
      }, {
        name: "_widget_1566963500359",
        text: "申请日期",
        id: "5d5e5355ea400906ea1f45e0",
        form: "5d5e5355ea400906ea1f45e0",
        type: "datetime",
        format: "yyyy-MM-dd",
        visible: true
      }, {
        name: "_widget_1503908656032",
        text: "采购单号",
        id: "5d5e5355ea400906ea1f45e0",
        form: "5d5e5355ea400906ea1f45e0",
        type: "text",
        visible: true
      }, {
        name: "_widget_1503473843970",
        text: "采购明细",
        id: "5d5e5355ea400906ea1f45e0",
        form: "5d5e5355ea400906ea1f45e0",
        type: "subform",
        visible: true,
        items: [{
          name: "_widget_1503908656117",
          text: "商品名称",
          id: "5d5e5355ea400906ea1f45e0",
          form: "5d5e5355ea400906ea1f45e0",
          type: "text",
          visible: true
        }, {
          name: "_widget_1503908656150",
          text: "型号规格",
          id: "5d5e5355ea400906ea1f45e0",
          form: "5d5e5355ea400906ea1f45e0",
          type: "text",
          visible: true
        }, {
          name: "_widget_1503908656134",
          text: "数量",
          id: "5d5e5355ea400906ea1f45e0",
          form: "5d5e5355ea400906ea1f45e0",
          type: "number",
          visible: true
        }, {
          name: "_widget_1503908656182",
          text: "单位",
          id: "5d5e5355ea400906ea1f45e0",
          form: "5d5e5355ea400906ea1f45e0",
          type: "text",
          visible: true
        }, {
          name: "_widget_1503908656199",
          text: "价格",
          id: "5d5e5355ea400906ea1f45e0",
          form: "5d5e5355ea400906ea1f45e0",
          type: "number",
          visible: true
        }, {
          name: "_widget_1504861891578",
          text: "小计",
          id: "5d5e5355ea400906ea1f45e0",
          form: "5d5e5355ea400906ea1f45e0",
          type: "number",
          visible: true
        }]
      }, {
        name: "_widget_1504862303138",
        text: "采购总额",
        id: "5d5e5355ea400906ea1f45e0",
        form: "5d5e5355ea400906ea1f45e0",
        type: "number",
        visible: true
      }]
    }, {
      appId: "5eb607d911a51100060e0549",
      entryId: "5d5e534c0ef5a0440f2d8db1",
      name: "办公用品申请",
      type: "form",
      hasExtParams: false,
      extParams: [],
      icon: 5,
      fields: [{
        name: "_widget_1566453833659",
        text: "申请日期",
        id: "5d5e534c0ef5a0440f2d8db1",
        form: "5d5e534c0ef5a0440f2d8db1",
        type: "datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        visible: true
      }, {
        name: "_widget_1566453833694",
        text: "领用人",
        id: "5d5e534c0ef5a0440f2d8db1",
        form: "5d5e534c0ef5a0440f2d8db1",
        type: "user",
        visible: true
      }, {
        name: "_widget_1566453833738",
        text: "领用部门",
        id: "5d5e534c0ef5a0440f2d8db1",
        form: "5d5e534c0ef5a0440f2d8db1",
        type: "dept",
        visible: true
      }, {
        name: "_widget_1566540758270",
        text: "领用明细",
        id: "5d5e534c0ef5a0440f2d8db1",
        form: "5d5e534c0ef5a0440f2d8db1",
        type: "subform",
        visible: true,
        items: [{
          name: "_widget_1566540758293",
          text: "物品名称",
          id: "5d5e534c0ef5a0440f2d8db1",
          form: "5d5e534c0ef5a0440f2d8db1",
          type: "combo",
          visible: true,
          items: [{
            text: "中性笔0.7mm",
            value: "中性笔0.7mm"
          }, {
            text: "南孚电池5号 两粒装",
            value: "南孚电池5号 两粒装"
          }, {
            text: "得力百事贴 76*76mm 100页",
            value: "得力百事贴 76*76mm 100页"
          }, {
            text: "得力封箱胶带 6卷装",
            value: "得力封箱胶带 6卷装"
          }, {
            text: "晨光易擦白板笔",
            value: "晨光易擦白板笔"
          }, {
            text: "美工刀片 10片装",
            value: "美工刀片 10片装"
          }, {
            text: "得力万能胶 20g",
            value: "得力万能胶 20g"
          }, {
            text: "中性笔芯 0.5mm",
            value: "中性笔芯 0.5mm"
          }]
        }, {
          name: "_widget_1566540758363",
          text: "数量",
          id: "5d5e534c0ef5a0440f2d8db1",
          form: "5d5e534c0ef5a0440f2d8db1",
          type: "number",
          visible: true
        }, {
          name: "_widget_1566540758438",
          text: "规格",
          id: "5d5e534c0ef5a0440f2d8db1",
          form: "5d5e534c0ef5a0440f2d8db1",
          type: "combo",
          visible: true,
          items: [{
            text: "支",
            value: "支"
          }, {
            text: "盒",
            value: "盒"
          }, {
            text: "包",
            value: "包"
          }, {
            text: "筒",
            value: "筒"
          }, {
            text: "瓶",
            value: "瓶"
          }]
        }, {
          name: "_widget_1566540758562",
          text: "用途说明",
          id: "5d5e534c0ef5a0440f2d8db1",
          form: "5d5e534c0ef5a0440f2d8db1",
          type: "text",
          visible: true
        }]
      }]
    }, {
      appId: "5eb607d911a51100060e0549",
      entryId: "5d5e533a6118a1037f0bf5fe",
      name: "员工档案",
      type: "form",
      hasExtParams: false,
      extParams: [],
      fields: [{
        name: "_widget_1504835294344",
        text: "员工姓名",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "user",
        visible: true
      }, {
        name: "_widget_1566438314046",
        text: "联系电话",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        regex: "^((\\(\\d{2,3}\\))|(\\d{3}\\-))?1\\d{10}$",
        visible: true
      }, {
        name: "_widget_1504841307509",
        text: "所属部门",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "dept",
        visible: true
      }, {
        name: "_widget_1504835294416",
        text: "岗位",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        visible: true
      }, {
        name: "_widget_1504835294456",
        text: "身份证号码",
        tab: "tab_1566438313893",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        regex: "(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)",
        visible: true
      }, {
        name: "_widget_1504835294522",
        text: "性别",
        tab: "tab_1566438313893",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "radiogroup",
        visible: true,
        items: [{
          text: "男",
          value: "男"
        }, {
          text: "女",
          value: "女"
        }]
      }, {
        name: "_widget_1566438314524",
        text: "出生日期",
        tab: "tab_1566438313893",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "datetime",
        format: "yyyy-MM-dd",
        visible: true
      }, {
        name: "_widget_1504835294469",
        text: "民族",
        tab: "tab_1566438313893",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        visible: true
      }, {
        name: "_widget_1566438314637",
        text: "户籍地址",
        tab: "tab_1566438313893",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "address",
        needDetail: false,
        visible: true
      }, {
        name: "_widget_1504835294606",
        text: "婚姻状态",
        tab: "tab_1566438313893",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "combo",
        visible: true,
        items: [{
          text: "未婚",
          value: "未婚"
        }, {
          text: "已婚",
          value: "已婚"
        }, {
          text: "离异",
          value: "离异"
        }, {
          text: "丧偶",
          value: "丧偶"
        }]
      }, {
        name: "_widget_1504835294651",
        text: "学历",
        tab: "tab_1566438313894",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "combo",
        visible: true,
        items: [{
          text: "初中",
          value: "初中"
        }, {
          text: "高中",
          value: "高中"
        }, {
          text: "专科",
          value: "专科"
        }, {
          text: "本科",
          value: "本科"
        }, {
          text: "硕士",
          value: "硕士"
        }, {
          text: "博士",
          value: "博士"
        }, {
          text: "博士后",
          value: "博士后"
        }]
      }, {
        name: "_widget_1566438314841",
        text: "毕业时间",
        tab: "tab_1566438313894",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "datetime",
        format: "yyyy-MM-dd",
        visible: true
      }, {
        name: "_widget_1504835294638",
        text: "毕业院校",
        tab: "tab_1566438313894",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        visible: true
      }, {
        name: "_widget_1504835294700",
        text: "专业",
        tab: "tab_1566438313894",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        visible: true
      }, {
        name: "_widget_1566438315016",
        text: "邮箱",
        tab: "tab_1566438313895",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        regex: "^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$",
        visible: true
      }, {
        name: "_widget_1504835294749",
        text: "现居地址",
        tab: "tab_1566438313895",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "address",
        needDetail: true,
        visible: true
      }, {
        name: "_widget_1504835294763",
        text: "紧急联系人",
        tab: "tab_1566438313895",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        visible: true
      }, {
        name: "_widget_1504835294776",
        text: "紧急联系人联系电话",
        tab: "tab_1566438313895",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        regex: "^((\\(\\d{2,3}\\))|(\\d{3}\\-))?1\\d{10}$",
        visible: true
      }, {
        name: "_widget_1504835294429",
        text: "入职时间",
        tab: "tab_1566438315521",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "datetime",
        format: "yyyy-MM-dd",
        visible: true
      }, {
        name: "_widget_1566438315770",
        text: "社保缴纳",
        tab: "tab_1566438315521",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "radiogroup",
        visible: true,
        items: [{
          text: "已参保",
          value: "已参保",
          widgetsMap: ["_widget_1566438315755", "_widget_1566438315975"]
        }, {
          text: "未参保",
          value: "未参保",
          widgetsMap: []
        }]
      }, {
        name: "_widget_1566438315755",
        text: "社保账号",
        tab: "tab_1566438315521",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        visible: true
      }, {
        name: "_widget_1566438315975",
        text: "社保缴纳地",
        tab: "tab_1566438315521",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "text",
        visible: true
      }, {
        name: "_widget_1566438316172",
        text: "劳务合同",
        tab: "tab_1566438315521",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "radiogroup",
        visible: true,
        items: [{
          text: "已签订",
          value: "已签订",
          widgetsMap: ["_widget_1566438315733"]
        }, {
          text: "未签订",
          value: "未签订",
          widgetsMap: []
        }]
      }, {
        name: "_widget_1566438315733",
        text: "合同查看",
        tab: "tab_1566438315521",
        id: "5d5e533a6118a1037f0bf5fe",
        form: "5d5e533a6118a1037f0bf5fe",
        type: "upload",
        visible: true,
        maxFileCount: 10
      }]
    }, {
      appId: "5eb607d911a51100060e0549",
      entryId: "5d5e53470a82ce034e0a8cf9",
      name: "产品管理",
      type: "form",
      hasExtParams: false,
      extParams: [],
      icon: 17,
      fields: [{
        name: "_widget_1504861446461",
        text: "产品名称",
        id: "5d5e53470a82ce034e0a8cf9",
        form: "5d5e53470a82ce034e0a8cf9",
        type: "text",
        visible: true
      }, {
        name: "_widget_1566442726206",
        text: "产品编号",
        id: "5d5e53470a82ce034e0a8cf9",
        form: "5d5e53470a82ce034e0a8cf9",
        type: "sn",
        visible: true
      }, {
        name: "_widget_1566442726264",
        text: "产品分类",
        id: "5d5e53470a82ce034e0a8cf9",
        form: "5d5e53470a82ce034e0a8cf9",
        type: "combo",
        visible: true,
        items: [{
          text: "功能饮料",
          value: "功能饮料"
        }, {
          text: "包装饮用水",
          value: "包装饮用水"
        }, {
          text: "果蔬汁饮料",
          value: "果蔬汁饮料"
        }, {
          text: "茶类饮料",
          value: "茶类饮料"
        }]
      }, {
        name: "_widget_1504861446537",
        text: "型号规格",
        id: "5d5e53470a82ce034e0a8cf9",
        form: "5d5e53470a82ce034e0a8cf9",
        type: "text",
        visible: true
      }, {
        name: "_widget_1504861446563",
        text: "单位",
        id: "5d5e53470a82ce034e0a8cf9",
        form: "5d5e53470a82ce034e0a8cf9",
        type: "combo",
        visible: true,
        items: [{
          text: "箱",
          value: "箱"
        }, {
          text: "盒",
          value: "盒"
        }, {
          text: "瓶",
          value: "瓶"
        }]
      }, {
        name: "_widget_1566540311870",
        text: "产品定价",
        id: "5d5e53470a82ce034e0a8cf9",
        form: "5d5e53470a82ce034e0a8cf9",
        type: "number",
        visible: true
      }, {
        name: "_widget_1566442726282",
        text: "产品图片",
        id: "5d5e53470a82ce034e0a8cf9",
        form: "5d5e53470a82ce034e0a8cf9",
        type: "image",
        visible: true,
        maxFileCount: 10
      }]
    }, {
      appId: "5eb607d911a51100060e0549",
      entryId: "5d5e5341cbad03070200c798",
      name: "客户信息",
      type: "form",
      hasExtParams: false,
      extParams: [],
      icon: 16,
      fields: [{
        name: "_widget_1504237153819",
        text: "客户名称",
        id: "5d5e5341cbad03070200c798",
        form: "5d5e5341cbad03070200c798",
        type: "text",
        visible: true
      }, {
        name: "_widget_1504248679033",
        text: "客户所在行业",
        id: "5d5e5341cbad03070200c798",
        form: "5d5e5341cbad03070200c798",
        type: "combo",
        visible: true,
        items: [{
          value: "物流",
          text: "物流"
        }, {
          value: "商贸",
          text: "商贸"
        }, {
          value: "广告",
          text: "广告"
        }, {
          value: "公关",
          text: "公关"
        }, {
          value: "外贸",
          text: "外贸"
        }, {
          value: "生产",
          text: "生产"
        }, {
          value: "互联网",
          text: "互联网"
        }, {
          value: "电商",
          text: "电商"
        }, {
          value: "其他",
          text: "其他"
        }]
      }, {
        name: "_widget_1504237153832",
        text: "客户地址",
        id: "5d5e5341cbad03070200c798",
        form: "5d5e5341cbad03070200c798",
        type: "address",
        needDetail: true,
        visible: true
      }, {
        name: "_widget_1504237153846",
        text: "联系人",
        id: "5d5e5341cbad03070200c798",
        form: "5d5e5341cbad03070200c798",
        type: "text",
        visible: true
      }, {
        name: "_widget_1504237153859",
        text: "联系电话",
        id: "5d5e5341cbad03070200c798",
        form: "5d5e5341cbad03070200c798",
        type: "text",
        regex: "^((\\(\\d{2,3}\\))|(\\d{3}\\-))?1\\d{10}$",
        visible: true
      }, {
        name: "_widget_1504237154037",
        text: "备注信息",
        id: "5d5e5341cbad03070200c798",
        form: "5d5e5341cbad03070200c798",
        type: "textarea",
        visible: true
      }]
    }],
    aggregate_table: []
  },
  content: {
    items: [{
      widget: {
        type: "separator",
        widgetName: "_widget_1567736868599",
        enable: true,
        visible: true,
        allowBlank: true,
        value: "<p><span style=\"font-size:18px; color:rgb(92, 184, 92);\"><span style=\"font-size:16px;\">以下为</span><span style=\"font-size:16px;\">示例流程表单</span><span style=\"font-size:16px;\">，您可以在电脑端自由修改或创建新的流程表单。</span></span><br></p>",
        lineStyle: "none"
      },
      description: null,
      label: "",
      lineWidth: 12
    }, {
      widget: {
        type: "separator",
        widgetName: "_widget_1567736868607",
        enable: true,
        visible: true,
        allowBlank: true,
        lineStyle: "thin"
      },
      description: null,
      label: "",
      lineWidth: 12
    }, {
      widget: {
        type: "sn",
        widgetName: "_widget_1566541681583",
        visible: true,
        rules: [{
          type: "incNumber",
          digitsNum: 5,
          resetDuration: "none",
          startValue: 1,
          fixedLength: true
        }],
        enable: false
      },
      description: null,
      label: "订单编号",
      lineWidth: 12
    }, {
      widget: {
        type: "user",
        widgetName: "_widget_1504855929239",
        enable: true,
        visible: true,
        allowBlank: true,
        value: {
          _id: "100000000000000000000001",
          nickname: "当前用户"
        },
        noRepeat: false,
        valueOption: 0
      },
      description: null,
      label: "制单人",
      lineWidth: 12
    }, {
      widget: {
        type: "datetime",
        widgetName: "_widget_1504854132055",
        enable: true,
        visible: true,
        allowBlank: true,
        rely: null,
        value: "today",
        format: "yyyy-MM-dd"
      },
      description: null,
      label: "下单日期",
      lineWidth: 12
    }, {
      widget: {
        type: "linkdata",
        widgetName: "_widget_1566449794137",
        enable: true,
        visible: true,
        allowBlank: true,
        linkFilter: [],
        linkFields: [{
          name: "_widget_1504237153819",
          text: "客户名称",
          type: "text"
        }],
        linkForm: "5d5e5341cbad03070200c798",
        linkKey: "_widget_1504237153819",
        linkType: "text",
        refAppId: null,
        allowAdd: true
      },
      description: null,
      label: "客户信息",
      lineWidth: 12
    }, {
      widget: {
        type: "text",
        widgetName: "_widget_1504855929117",
        enable: true,
        visible: true,
        allowBlank: true,
        rely: {
          widgets: ["_widget_1566449794137"],
          ref: {
            formId: "5d5e5341cbad03070200c798",
            field: "_widget_1504237153819"
          },
          data: {
            formId: "5d5e5341cbad03070200c798",
            field: "_widget_1504237153846"
          }
        },
        value: null,
        noRepeat: false
      },
      description: null,
      label: "联系人",
      lineWidth: 12
    }, {
      widget: {
        type: "text",
        widgetName: "_widget_1504854132042",
        enable: true,
        visible: true,
        allowBlank: true,
        rely: {
          widgets: ["_widget_1566449794137"],
          ref: {
            formId: "5d5e5341cbad03070200c798",
            field: "_widget_1504237153819"
          },
          data: {
            formId: "5d5e5341cbad03070200c798",
            field: "_widget_1504237153859"
          }
        },
        value: null,
        regex: "^((\\(\\d{2,3}\\))|(\\d{3}\\-))?1\\d{10}$",
        noRepeat: false
      },
      description: null,
      label: "联系电话",
      lineWidth: 12
    }, {
      widget: {
        type: "address",
        widgetName: "_widget_1504855928760",
        enable: true,
        visible: true,
        allowBlank: true,
        rely: {
          widgets: ["_widget_1566449794137"],
          ref: {
            formId: "5d5e5341cbad03070200c798",
            field: "_widget_1504237153819"
          },
          data: {
            formId: "5d5e5341cbad03070200c798",
            field: "_widget_1504237153832"
          }
        },
        value: null,
        needDetail: true
      },
      description: null,
      label: "发货地址",
      lineWidth: 12
    }, {
      widget: {
        type: "subform",
        widgetName: "_widget_1504854132443",
        enable: true,
        visible: true,
        allowBlank: true,
        subform_create: true,
        subform_edit: true,
        subform_delete: true,
        items: [{
          label: "关联数据",
          widget: {
            type: "linkdata",
            widgetName: "_widget_1566976937263",
            enable: true,
            visible: true,
            allowBlank: true,
            linkFilter: [],
            linkFields: [{
              name: "_widget_1566442726282",
              text: "产品图片",
              type: "image"
            }, {
              name: "_widget_1504861446461",
              text: "产品名称",
              type: "text"
            }, {
              name: "_widget_1504861446537",
              text: "型号规格",
              type: "text"
            }, {
              name: "_widget_1504861446563",
              text: "单位",
              type: "combo"
            }],
            linkForm: "5d5e53470a82ce034e0a8cf9",
            linkKey: "_widget_1504861446461",
            linkType: "text",
            refAppId: null
          }
        }, {
          label: "单价",
          widget: {
            type: "number",
            widgetName: "_widget_1566976937682",
            enable: true,
            visible: true,
            allowBlank: true,
            allowDecimals: true,
            maxNumber: null,
            minNumber: null
          }
        }, {
          label: "数量",
          widget: {
            type: "number",
            widgetName: "_widget_1504855928911",
            enable: true,
            visible: true,
            allowBlank: true,
            allowDecimals: false
          }
        }, {
          label: "金额",
          widget: {
            type: "number",
            widgetName: "_widget_1504855928943",
            enable: true,
            visible: true,
            allowBlank: true,
            rely: {
              widgets: ["_widget_1504854132443._widget_1504855928911", "_widget_1504854132443._widget_1566976937682"],
              formula: {
                type: "formula",
                text: "公式",
                formula: "$_widget_1504854132443._widget_1504855928911#*$_widget_1504854132443._widget_1566976937682#"
              }
            },
            value: null,
            allowDecimals: false
          }
        }]
      },
      description: null,
      label: "订单明细",
      lineWidth: 12
    }, {
      widget: {
        type: "number",
        widgetName: "_widget_1504855929151",
        enable: true,
        visible: true,
        allowBlank: true,
        rely: {
          widgets: ["_widget_1504854132443._widget_1504855928943"],
          formula: {
            type: "formula",
            text: "公式",
            formula: "SUM($_widget_1504854132443._widget_1504855928943#)"
          }
        },
        value: null,
        allowDecimals: true
      },
      description: null,
      label: "订单总额",
      lineWidth: 12
    }, {
      widget: {
        type: "number",
        widgetName: "_widget_1504860127112",
        enable: true,
        visible: true,
        allowBlank: true,
        value: null,
        allowDecimals: true
      },
      description: null,
      label: "预付金",
      lineWidth: 12
    }, {
      widget: {
        type: "number",
        widgetName: "_widget_1504855929162",
        enable: true,
        visible: true,
        allowBlank: true,
        rely: {
          widgets: ["_widget_1504855929151", "_widget_1504860127112"],
          formula: {
            type: "formula",
            text: "公式",
            formula: "$_widget_1504855929151#-$_widget_1504860127112#"
          }
        },
        value: null,
        allowDecimals: true
      },
      description: null,
      label: "待付款",
      lineWidth: 12
    }],
    type: "form",
    validators: [],
    submitRule: 1,
    layout: "normal"
  },
  attr: {
    showFields: [
      "_widget_1566541681583",
      "_widget_1504855929239",
      "_widget_1504854132055",
      "_widget_1566449794137",
      "_widget_1504855929117",
      "_widget_1504854132042",
      "_widget_1504855928760",
      "_widget_1504854132443._widget_1566976937263",
      "_widget_1504854132443._widget_1566976937682",
      "_widget_1504854132443._widget_1504855928911",
      "_widget_1504854132443._widget_1504855928943",
      "_widget_1504855929151",
      "_widget_1504860127112",
      "_widget_1504855929162",
      "creator",
      "createTime",
      "updateTime",
      "flowState",
      "chargers"],
    showFieldsMeta: {
      rowCheck: {
        width: 35
      },
      _widget_1504855929239: {
        width: 150
      },
      _widget_1504854132055: {
        width: 150
      },
      _widget_1504855929117: {
        width: 150
      },
      _widget_1504854132042: {
        width: 150
      },
      _widget_1504855928760: {
        width: 300
      },
      _widget_1504855928911: {
        subform: "_widget_1504854132443",
        width: 150
      },
      _widget_1504855928943: {
        subform: "_widget_1504854132443",
        width: 150
      },
      _widget_1504855929151: {
        width: 150
      },
      _widget_1504860127112: {
        width: 150
      },
      _widget_1504855929162: {
        width: 150
      },
      flowState: {
        width: 150
      },
      node: {
        subform: "chargers",
        width: 150
      },
      charger: {
        subform: "chargers",
        width: 150
      },
      label: {
        width: 150
      },
      _widget_1566541681583: {
        width: 150
      },
      _widget_1566449794137: {
        width: 150
      },
      _widget_1566976937263: {
        subform: "_widget_1504854132443",
        width: 517
      },
      _widget_1566976937682: {
        subform: "_widget_1504854132443",
        width: 150
      },
      creator: {
        width: 150
      },
      createTime: {
        width: 150
      },
      updateTime: {
        width: 150
      }
    },
    isPublic: false,
    isQuery: false,
    queryFields: [],
    filterFields: [],
    hasExtParams: false,
    extParams: [],
    hasCoop: false,
    hasFlow: true,
    hasCache: false,
    flow: {
      flowVer: "1",
      allowRevoke: true,
      hasLogView: true,
      versions: [{
        ver: "1"
      }],
      designVer: [],
      hasDingtalkMessage: false,
      hasWechatMessage: false,
      hasMailMessage: false,
      verId: 1,
      msgChannels: ["wechat", "mail"],
      has_dingtalk_todo: false
    },
    parent: "1",
    comment: {
      enable: false,
      channels: ["site"]
    },
    tabs: [],
    mobileLayout: {
      widget: "normal"
    },
    formEvents: []
  }
};
