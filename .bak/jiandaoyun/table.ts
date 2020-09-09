module.exports = {
  "_id": "5eb607d911a51100060e0551",
  "appId": "5eb607d911a51100060e0549",
  "entryId": "5d6643b2e2157f5e97b6c550",
  "name": "员工信息分析",
  "components": {
    "_widget_1566983107435": {
      "title": "员工总数",
      "form": "5d5e533a6118a1037f0bf5fe",
      "type": "metric_table",
      "hasExport": true,
      "palette": "preset_1",
      "chart_label": {
        "enable": true
      },
      "width": 15,
      "height": 16,
      "posX": 26,
      "posY": 0,
      "permission": "all",
      "value_size": "L",
      "fields": [],
      "top": {},
      "rowOrder": {},
      "guideline": [],
      "color": "",
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "thresholds": [],
      "mobileStyle": {
        "seq": 1,
        "width": 6,
        "height": 2,
        "visible": true
      },
      "xFields": [],
      "yFields": [],
      "metrics": [{
        "name": "_widget_1504835294456",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "身份证号码",
        "tag": "f_1566983086611",
        "format": "",
        "op": "count"
      }],
      "formulas": []
    },
    "_widget_1566983168571": {
      "title": "性别分布",
      "form": "5d5e533a6118a1037f0bf5fe",
      "type": "pie_chart",
      "hasExport": true,
      "palette": "preset_3",
      "chart_label": {
        "dimension": {
          "enable": true
        },
        "value": {
          "enable": true
        },
        "value_percent": {
          "enable": true
        },
        "enable": true
      },
      "width": 26,
      "height": 33,
      "posX": 0,
      "posY": 7,
      "permission": "all",
      "value_size": "M",
      "fields": [],
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "rowOrder": {},
      "thresholds": [],
      "guideline": [],
      "color": "",
      "triggers": ["_widget_1566983107435", "_widget_1566983426334", "_widget_1566983641550", "_widget_1566983761348", "_widget_1566984338763", "_widget_1566984675946"],
      "mobileStyle": {
        "seq": 3,
        "width": 6,
        "height": 4,
        "visible": true
      },
      "xFields": [{
        "name": "_widget_1504835294522",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "radiogroup",
        "title": "性别",
        "tag": "f_1566983086668",
        "colors": [{
          "value": "女",
          "color": "#BCBFA4"
        }, {
          "value": "男",
          "color": "#366D73"
        }]
      }],
      "yFields": [],
      "metrics": [{
        "name": "_widget_1504835294456",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "身份证号码",
        "tag": "f_1566983086678",
        "format": "",
        "op": "count"
      }],
      "formulas": []
    },
    "_widget_1566983426334": {
      "title": "户籍分布",
      "form": "5d5e533a6118a1037f0bf5fe",
      "type": "map_chart",
      "hasExport": true,
      "palette": "preset_map_5",
      "chart_label": {
        "dimension": {
          "enable": true
        },
        "value": {
          "enable": true
        },
        "enable": true
      },
      "width": 23,
      "height": 28,
      "posX": 0,
      "posY": 67,
      "permission": "all",
      "value_size": "M",
      "fields": [],
      "top": {},
      "rowOrder": {},
      "guideline": [],
      "map_type": "area",
      "defaultSort": [],
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "thresholds": [],
      "triggers": ["_widget_1566983107435", "_widget_1566983168571", "_widget_1566983641550", "_widget_1566983761348", "_widget_1566984338763", "_widget_1566984675946"],
      "color": "#BCBFA4 0%,#366D73 100%",
      "mobileStyle": {
        "seq": 6,
        "width": 6,
        "height": 4,
        "visible": true
      },
      "xFields": [{
        "name": "_widget_1566438314637",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "address",
        "title": "户籍地址",
        "tag": "f_1566983086749"
      }],
      "yFields": [],
      "metrics": [{
        "name": "_widget_1504835294456",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "身份证号码",
        "tag": "f_1566983086755",
        "format": "",
        "op": "count"
      }],
      "formulas": [],
      "drilldown": "none"
    },
    "_widget_1566983641550": {
      "title": "学历分布",
      "form": "5d5e533a6118a1037f0bf5fe",
      "type": "column_chart",
      "hasExport": true,
      "palette": "preset_3",
      "chart_label": {
        "enable": true
      },
      "width": 34,
      "height": 24,
      "posX": 26,
      "posY": 16,
      "permission": "all",
      "value_size": "S",
      "fields": [],
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "rowOrder": {},
      "thresholds": [],
      "guideline": [],
      "defaultSort": [{
        "f_1566983086805": -1
      }],
      "triggers": ["_widget_1566983107435", "_widget_1566983168571", "_widget_1566983426334", "_widget_1566983761348", "_widget_1566984338763", "_widget_1566984675946"],
      "mobileStyle": {
        "seq": 4,
        "width": 6,
        "height": 4,
        "visible": true
      },
      "xFields": [{
        "name": "_widget_1504835294651",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "combo",
        "title": "学历",
        "tag": "f_1566983086795",
        "colors": [{
          "color": "#366D73",
          "value": "本科"
        }, {
          "color": "#5A8C8C",
          "value": "博士"
        }, {
          "color": "#BCBFA4",
          "value": "博士后"
        }, {
          "color": "#F2E6C2",
          "value": "高中"
        }, {
          "color": "#BFA288",
          "value": "硕士"
        }, {
          "color": "#A98A61",
          "value": "专科"
        }],
        "defaultColor": "#366D73"
      }],
      "yFields": [],
      "metrics": [{
        "name": "_widget_1504835294456",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "人数",
        "tag": "f_1566983086805",
        "format": "",
        "op": "count"
      }],
      "formulas": []
    },
    "_widget_1566983761348": {
      "title": "入职人数的时间分布",
      "form": "5d5e533a6118a1037f0bf5fe",
      "type": "line_chart",
      "hasExport": true,
      "palette": "preset_3",
      "chart_label": {
        "enable": true
      },
      "width": 60,
      "height": 27,
      "posX": 0,
      "posY": 40,
      "permission": "all",
      "value_size": "M",
      "fields": [],
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "rowOrder": {},
      "thresholds": [],
      "guideline": [],
      "yAxes": [{
        "chart_type": "column_chart"
      }, {
        "chart_type": "line_chart"
      }],
      "top": {},
      "color": "",
      "triggers": ["_widget_1566983107435", "_widget_1566983168571", "_widget_1566983426334", "_widget_1566983641550", "_widget_1566984338763", "_widget_1566984675946"],
      "legend": {
        "enable": true,
        "position": "bottom"
      },
      "mobileStyle": {
        "seq": 5,
        "width": 6,
        "height": 4,
        "visible": true
      },
      "xFields": [{
        "name": "_widget_1504835294429",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "datetime",
        "format": "yyyy-MM-dd",
        "title": "入职时间",
        "groupRule": "year_month",
        "tag": "f_1566983086851"
      }],
      "yFields": [],
      "metrics": [{
        "name": "_widget_1504835294456",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "人数",
        "tag": "f_1566983086861",
        "format": "",
        "op": "count",
        "metricType": "left",
        "color": "#366D73"
      }],
      "formulas": []
    },
    "_widget_1566984338763": {
      "title": "员工基础信息明细",
      "form": "5d5e533a6118a1037f0bf5fe",
      "type": "data_table",
      "hasExport": false,
      "palette": "preset_1",
      "chart_label": {
        "enable": true
      },
      "width": 37,
      "height": 28,
      "posX": 23,
      "posY": 67,
      "permission": "all",
      "value_size": "S",
      "fields": [{
        "name": "_widget_1504835294344",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "user",
        "title": "员工姓名",
        "tag": "f_1566984286321"
      }, {
        "name": "_widget_1504835294522",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "radiogroup",
        "title": "性别",
        "tag": "f_1566984286353"
      }, {
        "name": "_widget_1566438314046",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "联系电话",
        "tag": "f_1566984286329"
      }, {
        "name": "_widget_1504835294416",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "岗位",
        "tag": "f_1566984286345"
      }, {
        "name": "_widget_1504835294429",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "datetime",
        "format": "yyyy-MM-dd",
        "title": "入职时间",
        "tag": "f_1566984286361"
      }],
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "rowOrder": {
        "enable": false
      },
      "mobileStyle": {
        "seq": 7,
        "width": 6,
        "height": 6,
        "visible": true
      },
      "xFields": [],
      "yFields": [],
      "metrics": [],
      "formulas": []
    },
    "_widget_1566984286400": {
      "title": "岗位",
      "defaultConfig": {
        "hasEmpty": false,
        "items": []
      },
      "valueMode": "item",
      "method": "in",
      "type": "text_filter",
      "fields": [{
        "form": "5d5e533a6118a1037f0bf5fe",
        "field": "_widget_1504835294416",
        "type": "text"
      }],
      "triggers": ["_widget_1566983107435", "_widget_1566983168571", "_widget_1566983426334", "_widget_1566983641550", "_widget_1566983761348", "_widget_1566984338763"],
      "width": 20,
      "height": 7,
      "posX": 0,
      "posY": 0
    },
    "_widget_1566984286411": {
      "type": "filter_btn",
      "width": 6,
      "height": 7,
      "posX": 20,
      "posY": 0,
      "title": ""
    },
    "_widget_1566984675946": {
      "title": "不同部门人数统计",
      "form": "5d5e533a6118a1037f0bf5fe",
      "type": "metric_table",
      "hasExport": true,
      "palette": "preset_1",
      "chart_label": {
        "enable": true
      },
      "width": 19,
      "height": 16,
      "posX": 41,
      "posY": 0,
      "permission": "all",
      "value_size": "M",
      "fields": [],
      "top": {},
      "rowOrder": {},
      "guideline": [],
      "color": "",
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "thresholds": [],
      "mobileStyle": {
        "seq": 2,
        "width": 6,
        "height": 4,
        "visible": true
      },
      "xFields": [{
        "name": "_widget_1504835294416",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "岗位",
        "tag": "f_1577324310887"
      }],
      "yFields": [],
      "metrics": [{
        "name": "_widget_1504835294456",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "身份证号码",
        "tag": "f_1566984286482",
        "format": "",
        "op": "count"
      }],
      "formulas": []
    },
    "_widget_1597310118407": {
      "type": "data_manage",
      "form": "5d5e5355ea400906ea1f45e0",
      "dateField": "",
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "title": "数据管理表格",
      "permission": "form",
      "mobileStyle": {
        "visible": true,
        "seq": 7,
        "width": 6,
        "height": 6
      },
      "width": 60,
      "height": 30,
      "posX": 0,
      "posY": 95
    },
    "_widget_1597312516769": {
      "title": "未命名图表",
      "form": "5d5e535132b989071ad102a0",
      "type": "data_table",
      "hasExport": false,
      "palette": "preset_1",
      "chart_label": {
        "enable": true
      },
      "mobileStyle": {
        "visible": true,
        "seq": 7,
        "width": 6,
        "height": 6
      },
      "width": 30,
      "height": 20,
      "posX": 0,
      "posY": 125,
      "permission": "all",
      "value_size": "S",
      "fields": [],
      "xFields": [],
      "yFields": [],
      "metrics": [],
      "formulas": []
    },
    "_widget_1597838768614": {
      "title": "性别分布_拷贝",
      "form": "5d5e533a6118a1037f0bf5fe",
      "type": "pie_chart",
      "hasExport": true,
      "palette": "preset_3",
      "chart_label": {
        "dimension": {
          "enable": true
        },
        "value": {
          "enable": true
        },
        "value_percent": {
          "enable": true
        },
        "enable": true
      },
      "width": 26,
      "height": 33,
      "posX": 30,
      "posY": 125,
      "permission": "all",
      "value_size": "M",
      "fields": [],
      "filter": {
        "cond": [],
        "rel": "and"
      },
      "rowOrder": {},
      "thresholds": [],
      "guideline": [],
      "color": "",
      "triggers": ["_widget_1566983107435", "_widget_1566983426334", "_widget_1566983641550", "_widget_1566983761348", "_widget_1566984338763", "_widget_1566984675946"],
      "mobileStyle": {
        "visible": true,
        "seq": 7,
        "width": 6,
        "height": 4
      },
      "drilldown": "pc",
      "xFields": [{
        "name": "_widget_1504835294522",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "radiogroup",
        "title": "性别",
        "tag": "f_1566983086668",
        "colors": [{
          "value": "女",
          "color": "#BCBFA4"
        }, {
          "value": "男",
          "color": "#366D73"
        }]
      }],
      "yFields": [],
      "metrics": [{
        "name": "_widget_1504835294456",
        "form": "5d5e533a6118a1037f0bf5fe",
        "type": "text",
        "title": "身份证号码",
        "tag": "f_1566983086678",
        "format": "",
        "op": "count"
      }],
      "formulas": []
    }
  },
  "mobileLayout": {
    "enable": true
  },
  "attr": {
    "isPublic": false,
    "parent": "1"
  },
  "checkConfig": {
    "_widget_1566984286400": {
      "code": 3000,
      "msg": "表单不存在"
    },
    "_widget_1566984286411": {
      "code": 3000,
      "msg": "表单不存在"
    }
  }
}