import { TypeOfIUBDSL } from "..";

/**
 * @description 整体运行链路
 * 1. 加载iub-dsl、解析并渲染页面绑定字段、用户输入触发校验、点击提交、查询校验、提交数据、反馈结果。
 * 2. 外部输入的处理、
 * 3. 导出和输出的处理。(提交至pageContext时)
 */

/**
 * @description 完整创建用户的描述
 *  TODO: 输入、输出、引用、导出若存在冲突？
 * 1. 输入username或引用其他页面的username
 * 2. 输出user表单或导出user表单
 * 3. 数据间的引用。以及数据校验 [元数据默认校验规则、控件配置校验规则]
 * 4. 提交后的反馈和后续操作
 */

/**
  * @description 问题
  * 1. 校验的rule放在哪
  * 2. schemas使用了input、refVar、defaultVal，哪个权重更高
  * 3.
  */
const SimpleCreateUser: TypeOfIUBDSL = {
  id: 'SimpleCreateUser',
  type: 'config',
  name: 'SimpleCreateUser',

  /** 元数据映射集合 [数据源关系枢纽] */
  metadataCollection: {
    dataSource: {
      userTable_UUID: {
        type: 'general',
        database: '-',
        tableName: 'user',
        columns: {
          field_UUID1: {
            field: 'username',
            type: 'string',
            len: 32
          },
          field_UUID2: {
            field: 'age',
            type: 'int',
            len: 3,
            // rule ?
          }
        }
      }
    },
  },

  /** 系统上下文接口 */
  sysRtCxtInterface: {
    exposeVar: {
      // TODO: 数组是否能支持？如何支持？
      // 输出key，接受key
      'userFrom.data_UUID1': 'var1',
      'userFrom.data_UUID2': 'var2',
    },
    refVar: {
      pageContext_UUID1: 'pageID.var1',
      // 'userFrom.data_UUID1': 'pageID.var1',
      // 'userFrom.data_UUID1': 'pageID.pageSchemasId.data_UUID1',
    },
    output: {
      type: '',
      struct: {
        'userFrom.data_UUID1': 'string',
        'userFrom.data_UUID2': 'int',
      }
    },
    // TODO: 挂在context上有声明还是不需要。？
    input: {
      type: '',
      struct: {
        pageContext_UUID2: 'string'
      }
    }
  },

  /** 数据模型 */
  schemas: {
    page: {
      // userFromKey如何定。这个应该也是唯一的
      userFrom_UUID: {
        type: 'object',
        struct: {
          data_UUID1: {
            type: 'string',
            defaultVal: '张三',
            fieldMapping: 'userTableId.field_UUID1', // metadataCollection.dataSource[userTableId].columns[field_UUID1]
            // TODO: 数据关系？？交给配置人员
            selectData: ['defaultVal', '@pageContextUUID1'],
            rules: [
              { require: true },
              { minLength: 3 },
              { maxLength: 32 },
              { sysRules: 'xxx' }, // ?
            ]
          },
          data_UUID2: {
            type: 'num',
            fieldMapping: 'userTableId.field_UUID2',
          }
        }
      },
      // TODO: 验证是分开还是一起。还是其他方式
      // validUserFrom: {
      //   type: 'object',
      //   struct: {
      //     data_UUID1: {
      //       type: 'boolean',
      //       rules: [
      //         { require: true },
      //         { minLength: 3 },
      //         { maxLength: 32 },
      //         { sysRules: 'xxx' }, // ?
      //       ]
      //     },
      //     data_UUID2: 'boolean'
      //   }
      // },
    },
    flow: {}
  },

  /** 布局信息 */
  layoutContent: {
    type: 'general',
    content: [
      {
        id: 'containerUUID1',
        type: 'container',
        layout: {
          type: 'flex',
          props: {
            justifyContent: 'start'
          },
        },
        // TODO: 布局解析？
        body: [
          {
            id: 'controlId1',
            type: 'componentRef',
            componentID: 'compUUID1'
          },
          {
            id: 'controlId2',
            type: 'componentRef',
            componentID: 'compUUID2'
          },
          {
            id: 'controlId3',
            type: 'componentRef',
            componentID: 'compUUID3'
          },
        ]
      }
    ]
  },

  /** 组件集合 */
  // TODO: 表单提交校验放在哪？
  componentsCollection: {
    compUUID1: {
      id: 'compUUID1',
      type: 'component',
      component: {
        type: 'Input',
        field: '@userFrom_UUID.data_UUID1'
      },
      props: {},
      actions: {}
    },
    compUUID2: {
      id: 'compUUID2',
      type: 'component',
      component: {
        type: 'Input',
        field: '@userFrom_UUID.data_UUID2'
      },
      props: {},
      actions: {
        onFocus: {
          type: 'actionRef',
          actionID: 'validAgeRules',
        }
      },
    },
    compUUID3: {
      id: 'compUUID3',
      type: 'component',
      component: {
        type: 'Button',
        text: '提交'
      },
      props: {},
      actions: {
        onClick: {
          type: 'actionRef',
          actionID: 'clickUUID1',
        }
      }
    }
  },

  /** 动作集合 */
  actionsCollection: {
    validAgeRules: {
      flowItems: {
        f1: {
          variable: 'var1',
          expression: '@showTip.success(@userFrom.data_UUID2, "年龄符合标准!")',
          isReturn: true,
        },
        f2: {
          variable: 'var2',
          expression: '@showTip.error("年龄不小于0。")',
          isReturn: true,
        },
        f3: {
          variable: 'var3',
          expression: '@showTip.warn(“年龄小于14岁请注意童工。”)',
          isReturn: true,
        },
        f4: {
          variable: 'var4',
          expression: '@showTip.warn("年龄过大注意劳动力不足。")',
          isReturn: true,
        }

      },
      flowCondition: {
        fe0: {
          variable: 'feVar0',
          expression: '@userFrom.data_UUID2 > 0'
        },
        fe1: {
          variable: 'feVar1',
          expression: '@userFrom.data_UUID2 > 14 && @userFrom.data_UUID2 <= 100'
        },
        fe2: {
          variable: 'feVar2',
          expression: '@userFrom.data_UUID2 > 100'
        },
      },
      // TODO: ?
      flowControl: `
        if(#feVar0) {
          if (#feVar1) {
            return #f1;
          } else if (#feVar2) {
            return #f4;
          } else {
            return #f3
          }
        } else {
          return #f2
        }
      `
    },
    clickUUID1: {
      flowItems: {
        f1: {
          variable: 'var1',
          expression: '@vaild(@validUserFrom)'
        },
        f2: {
          variable: 'var2',
          expression: '@insert(@userFrom)'
        },
        f3: {
          variable: 'var3',
          expression: '@showTip.warn("表单校验失败！")'
        }
      },
      flowControl: `
        if(#var1) {
          #f2;
          !showTip.sysDefault; // ?
        } else {
          #f3;
        }
      `
    }
  },

  /** 关系集合 */
  relationshipsCollection: {
    // ?
    // rulesCollections: {
    //   requiredRule: {
    //     type: 'required',
    //     comIds: ['cID'],
    //   }
    // }
  }
};

export default SimpleCreateUser;
