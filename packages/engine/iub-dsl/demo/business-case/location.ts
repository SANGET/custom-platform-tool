import { FoundationType, TypeOfIUBDSL, ComplexType } from "@iub-dsl/core";
import { ActionFlowKeywork } from "@iub-dsl/core/types/actions/action-flow";
import { ApbFunction } from "../../apb-dsl";

/**
 * 注意分开2个条件区分, 一个系统内、一个请求
 *
 * 1. 数据收集的问题 数据收集关系应该是统一收集,然后如何对应? 数据收集器的职能: 根据一个的描述规则, 收集运行时状态
 * 2. 关系处理的问题
 *  把数据获取回来后处理,?
 *  连表操作?
 * 3. 条件对应apb/条件处理的对应?
 * 4. 标准通信结构
 * 5. 如何支持多步骤的apb-dsl
 * 7. 每个单元格可以显示不同的内容
 */

const IUBLocationForm: TypeOfIUBDSL = {
  id: 'locationFrom',
  type: 'config',
  name: '位置管理表单',

  metadataCollection: {
    dataSource: {
      // 位置表
      tableId1: {
        type: 'general',
        database: '-',
        tableName: 'location',
        columns: {
          fieldId1: {
            type: FoundationType.string,
            field: 'id',
            len: 32
          },
          fieldId2: {
            type: FoundationType.string,
            field: 'location_name',
            len: 32
          },
          fieldId3: {
            type: FoundationType.string,
            field: 'pid',
            len: 32
          },
          fieldId4: {
            type: FoundationType.string,
            field: 'location_type',
            len: 32
          },
        }
      },
      // 位置类型字典 (根据位置表,位置类型的引用关系,额外获取的字典表的元数据信息)
      tableId2: {
        type: 'general',
        database: '-',
        tableName: 'location_type',
        columns: {
          fieldId1: {
            type: FoundationType.string,
            field: 'id',
            len: 32
          },
          fieldId2: {
            type: FoundationType.string,
            field: 'type',
            len: 32
          },
          fieldId3: {
            type: FoundationType.string,
            field: 'name',
            len: 32
          }
        }
      }
    },
    // 数据关系
    dataSourceRelation: {
      // tableId1这个表有2个引用关系「pid、locationType」
      tableId1: {
        relationId1: {
          type: 'quote',
          field: 'fieldId3',
          quoteInfo: {
            table: 'tableId1',
            field: 'fieldId1',
            quoteType: 'treeQuote'
          }
        },
        relationId2: {
          type: 'quote',
          field: 'fieldId4',
          quoteInfo: {
            table: 'tableId2',
            field: 'fieldId2',
            quoteType: 'quote'
          }
        }
      }
    }
  },

  schemas: {
    dId0: { // 表单隐藏的 ID
      type: FoundationType.string,
      fieldMapping: 'tableId1.fieldId1',
    },
    // 输入表单三个
    dId1: {
      type: FoundationType.string,
      desc: '位置名称',
      alias: 'location_name',
      fieldMapping: 'tableId1.fieldId2',
    },
    dId2: {
      type: FoundationType.string,
      desc: '位置类型',
      alias: 'location_type',
      fieldMapping: 'tableId1.fieldId4'
    },
    dId3: {
      type: ComplexType.structObject,
      desc: '上级位置',
      struct: {
        sdId1: {
          type: FoundationType.string,
          compTag: 'value',
          fieldMapping: 'tableId1.fieldId1',
        },
        sdId2: {
          type: FoundationType.string,
          compTag: 'show',
          fieldMapping: 'tableId1.fieldId2',
          desc: '位置名称'
        },
        sdId3: {
          type: FoundationType.string,
          fieldMapping: 'tableId1.fieldId4',
          desc: '位置类型'
        },
        sdId4: {
          type: FoundationType.string,
          fieldMapping: 'tableId1.fieldId3',
          desc: 'pid'
        },
      }
    },
    dId4: { // 位置类型下拉框
      type: ComplexType.structArray,
      desc: '位置类型数据',
      struct: {
        sdId0: {
          type: FoundationType.string,
          fieldMapping: 'tableId2.filedId1',
        },
        sdId1: {
          type: FoundationType.string,
          compTag: 'show',
          fieldMapping: 'tableId2.filedId2',
          desc: '显示值'
        },
        sdId2: {
          type: FoundationType.string,
          fieldMapping: 'tableId2.filedId3',
          compTag: 'value',
          desc: '实际值'
        }
      }
    },
    dId5: { // 位置管理表格数据
      type: ComplexType.structArray,
      desc: '位置管理表格数据',
      struct: {
        sdId0: {
          type: FoundationType.string,
          fieldMapping: 'tableId1.filedId1',
        },
        sdId1: {
          type: FoundationType.string,
          desc: '位置名字',
          fieldMapping: 'tableId1.filedId2',
        },
        sdId3: {
          type: ComplexType.structObject,
          desc: '上级位置',
          // TODO: 使用关系描述处理
          struct: {
            ssdId0: {
              type: FoundationType.string,
              fieldMapping: 'tableId1.filedId1',
              compTag: 'value',
            },
            ssdId1: {
              type: FoundationType.string,
              desc: '上级位置名字',
              fieldMapping: 'tableId1.filedId2',
              compTag: 'show',
            },
          }
        },
        sdId4: {
          type: ComplexType.structObject,
          desc: '位置名字',
          struct: {
            sdId0: {
              type: FoundationType.string,
              fieldMapping: 'tableId2.filedId1',
            },
            sdId1: {
              type: FoundationType.string,
              compTag: 'show',
              fieldMapping: 'tableId2.filedId2',
              desc: '显示值'
            },
            sdId2: {
              type: FoundationType.string,
              fieldMapping: 'tableId2.filedId3',
              compTag: 'value',
              desc: '实际值'
            }
          }
        },
      }
    }
  },
  relationshipsCollection: {
    dataCollection: {
      // 获取表单详情收集ID的描述
      collectId0: {
        type: ComplexType.structObject,
        struct: [
          { // 收集某个字段的完整描述
            condition: {
              conditionList: {
                condId1: {
                  operator: 'notEmpty',
                  exp1: '@(schemas).dId0'
                }
              },
              conditionControl: {
                and: ['condId1']
              }
            },
            when: ['update', 'detail'],
            collectField: '@(schemas).dId0'
          },
        ]
      },
      // 收集方式1
      collectNN: {
        type: ComplexType.structArray,
        struct: [
          '@(schemas).dId0', // 隐藏的id
          '@(schemas).dId14', // 表格的数据
        ]
      },
      // 收集方式2  // 提交/新增表单的收集描述
      collectId1: {
        type: ComplexType.structObject,
        struct: [
          {
            condition: {
              conditionList: {
                condId1: {
                  operator: 'notEmpty',
                  exp1: '@(schemas).dId0'
                }
              },
              conditionControl: {
                and: ['condId1']
              }
            },
            when: ['update'],
            collectField: '@(schemas).dId0'
          },
          // 没有条件和时机, 直接收集数据
          '@(schemas).dId1',
          '@(schemas).dId2',
          '@(schemas).dId3'
        ]
      },
      collectId99: { // 资产主表
        type: ComplexType.structObject,
        struct: [
          '@(schemas).dId0', // 隐藏的id
          '@(schemas).dId1', // 表达式的支持编码
          '@(schemas).dId2.sdId3', // 所属部门
          '@(schemas).dId3', // 资产类型
          '@(schemas).dId4', // 资产名称
          // 一组
          '@(schemas).dId5', // 存放建筑物
          '@(schemas).dId6', // 楼层
          '@(schemas).dId7', // 区域
          // 一组 end
          '@(schemas).dId8', // 库存状态
          '@(schemas).dId9', // 库存数量
        ]
      },
      collectId98: { // 附属表
        type: ComplexType.structObject,
        struct: [
          '@(schemas).dId0', // 隐藏的主表id
          '@(schemas).dId10', // 父设备
          '@(schemas).dId11', // 生产商
          '@(schemas).dId12', // 维修开始时间
          '@(schemas).dId13', // 维修结束时间
        ]
      },
      collectId97: {
        type: ComplexType.structArray,
        struct: [
          '@(schemas).dId0', // 隐藏的主表id
          '@(schemas).dId14' // 动态表格数据
        ]
      },
    },
    dataChanged: {
      changeId1: {
        when: ['onUserChange'],
        condition: {},
        changeAction: ['@(actionCollection).actionId0'] // 实际上初始化回填也是个联动
      }
    }
  },
  /**
   * 1. 初始化、插入、更新、回填
   * 2. 有关系的处理, 打开弹窗
   */
  actionsCollection: {
    // 初始化回填的APBDSL 「回填通过stateChange支持」
    actionId0: {
      type: 'ApbAction',
      // 查询表单详情的动作的触发时机
      when: ['updateAndPageMount', 'detailAndPageMount'],
      actionName: '初始化查询表单数据',
      businessCode: 'fn0',
      // APB-DSL的步骤 「应该再细分一下」
      apbActionList: {
        apbActionId1: {
          type: ApbFunction.SELECT,
          table: 'userInfo',
          condition: {
            conditionList: {
              condId1: {
                operator: 'equ',
                exp1: '@(metadataMapping).tableId1.filedId1',
                exp2: '@(schemas).dId0'
              }
            },
            conditionControl: {
              and: ['condId1']
            }
          }
        },
      },
      actionList: {
        // 改变页面运行时状态 [可对应: 回填、输入、赋值给控件、联动的动作的赋值部分]
        sActionId1: {
          type: 'updateState',
          actionName: '回填数据',
          // 方式1: 根据收集关系, 反向映射
          changeTarget: '@(dataCollection).collectId1', // schemas/dataCollect
          // 方式2: A to B
          changeMapping: {
            '@(metadataMapping).tableId1.filedId1': '@(schemas).dId0',
            '@(metadataMapping).tableId1.filedId2': '@(schemas).dId1',
            // '@(metadataMapping).tableId1.filedId3': '@(schemas).dId3',
            '@(metadataMapping).tableId1.filedId3': '@(schemas).dId3.sdId1',
            '@(metadataMapping).tableId1.filedId4': '@(schemas).dId2',
          },
        },
      },
      flow: [
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: '#(apbActionId1)',
        },
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: '#(sActionId1)',
        },
      ]
    },

    // 插入/修改
    actionId2: {
      type: 'ApbAction',
      actionName: '新增表格数据',
      when: ['insert'],
      businessCode: 'fn1',
      apbActionList: {
        apbActionId1: {
          table: 'userInfo',
          type: ApbFunction.SET,
          // ID或者是映射
          fieldMapping: '@(dataCollection).collectId1'
          // fieldMapping: {
          //   type: ComplexType.structObject,
          //   struct: []
          // }
        }
      },
      actionList: {
        sActionId1: {
          actionName: '新增用户的反馈',
          type: 'feedback',
          state: 'success',
          msg: '新增用户成功!'
        }
      },
      flow: [
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: '#(apbActionId1)',
        },
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: '#(sActionId1)',
        },
      ]
    },

    // TODO: 触发时机
    // 页面初始化获取位置类型字典数据
    actionId3: {
      type: 'ApbAction',
      actionName: '字典查询',
      when: ['pageMount'],
      businessCode: 'fn2',
      apbActionList: {
        apbActionId1: {
          type: ApbFunction.SELECT,
          table: 'location_type_table',
        }
      },
      actionList: {
        sActionId1: {
          actionName: '写入初始化的字典数据',
          type: 'updateState',
          // 对于表格下拉框/表单下拉框都多次使用一个字典数据, 应该只填入同一个数据模型 「有条件限制再额外考虑」
          changeTarget: '@(schemas).dId4'
        }
      },
      flow: [
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: '#(apbActionId1)',
        },
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: '#(sActionId1)',
        },
      ]
    },
    // pid额外关系处理
    // 这个应该是处理关系的时候生成的, 还是配置平台生成? 但是特定关系的处理是会变的
    actionId5: {
      type: 'ApbAction',
      actionName: '获取表格数',
      businessCode: 'fn3',
      actionList: {
        sActionId1: {
          actionName: '填入表格数据',
          type: 'updateState',
          changeTarget: '@(schemas).dId5'
        }
      },
      apbActionList: {
        apbActionId1: {
          type: ApbFunction.SELECT,
          table: 'haoyun_erp_dept',
          useQuoteRelation: [
            '@(dataSourceRelation).tableId1.relationId1', // pid引用关系
            '@(dataSourceRelation).tableId1.relationId2' // 字典引用关系
          ]
        },
        // 处理关系得是否额外新增的action, 当然也可以由配置生成
        apbActionId2: {
          type: ApbFunction.SELECT,
          table: 'haoyun_erp_dept',
          condition: {
            conditionList: {
              cond1: {
                operator: 'in',
                exp1: 'id',
                exp2: '#(apbActionList).apbActionId1.pid'
              }
            },
            conditionControl: {
              and: ['cond1']
            }
          }
        },
      },
      flow: [
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: '#(apbActionId1)',
          /**
           * pid引用关系的额外添加的子流程处理
           * 「pid引用关系及实际情况处理决定的, 由动作控制器动态实现动态添加额外动作」
           */
          childrenFlow: [
            {
              childrenFlowType: ActionFlowKeywork.AND,
              actionId: '#(apbActionId2)',
            }
          ]
        },
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: '#(sActionId1)'
        }
      ]
    },
    actionId6: {
      type: 'ApbAction',
      actionName: '多步新增',
      when: ['insert'],
      businessCode: 'fn1',
      apbActionList: {
        apbActionId1: {
          type: ApbFunction.SET,
          table: 'table1',
          fieldMapping: '@(dataCollection).collectId99'
        },
        apbActionId2: {
          type: ApbFunction.SET,
          table: 'table2',
          fieldMapping: '@(dataCollection).collectId98',
          useQuoteRelation: '@(dataSourceRelation).tableId1.relationId1' // 处理fid外键关系的
        },
        apbActionId3: {
          type: ApbFunction.SET,
          table: 'table3',
          fieldMapping: '@(dataCollection).collectId97',
          useQuoteRelation: '@(dataSourceRelation).tableId1.relationId1' // 处理fid外键关系的
        },
      },
      /**
       * apbActionId2、apbActionId3 均使用了引用关系
       * 故可根据该关系由独立的模块进一步处理将第一步的结果, 引用到第2、3步的apbdsl中
       */
      flow: [
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: 'apbActionId1',
        },
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: 'apbActionId2',
        },
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: 'apbActionId3',
        }
      ]
    },
    actionId7: {
      type: 'ApbAction',
      actionName: '多步骤变量的引用',
      businessCode: 'fn4',
      apbActionList: {
        apbActionId1: {
          type: ApbFunction.SELECT,
          table: 'table1',
        },
        apbActionId2: {
          type: ApbFunction.SELECT,
          table: 'table2',
          condition: {
            // 查询tableId2 用户名和table1用户名相同得数据
            conditionList: {
              /** 多步操作得支持
               * 1. 该配置是配置人员配置的
               * 2. 同一个动作可以确保上下文一致, 可以拼出 $.steps[0].name
               * 3. 前端有表元数据的描述, 可以确保字段必存在
               */
              cond1: {
                operator: 'in',
                exp1: '@(metadataMapping).tableId2.filedId1',
                exp2: '#(apbActionId1).name'
              }
            },
            conditionControl: {
              and: ['cond1']
            }
          }
        }
      },
      flow: [
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: 'apbActionId1',
        },
        {
          childrenFlowType: ActionFlowKeywork.AND,
          actionId: 'apbActionId2',
        },
      ]
    }
  },
};

export default IUBLocationForm;
