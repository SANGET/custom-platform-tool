import { FoundationType, TypeOfIUBDSL, ComplexType } from "@iub-dsl/core";

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
  },
  relationshipsCollection: {
    dataAndComponent: {
      type: ComplexType.structObject,
      struct: [
        '@(schemas).dId0', // 隐藏的id
        {
          // select a.*, b.* from tablea a
          // left join tableb b
          // on a.id = b.id
          // 收集前的key // TODO 连表, 关系「系统默认引用关系、用户可以额外配置」
          field: '@(metadataMapping).tableId1.filedId1',
          collectField: '@(schemas).dId1', // 收集的value
          // 条件
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
          // 时机
          when: ['update', 'detail'],
        }
      ]
    } as any,
    // 数据收集关系集合 「传参的收集、1页面传参数, apb-dsl传参数」
    // 如何获取数据, 获取的数据如何编排, 如果连表的呢?
    // 配置的时候是一一对应的, 就算多个表也一样啊,
    // 有关系的处理, 收集的条件
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
      // 表关系处理??
      collectN: {
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
          // 附属表
          '@(schemas).dId10', // 父设备
          '@(schemas).dId11', // 生产商
          '@(schemas).dId12', // 维修开始时间
          '@(schemas).dId13', // 维修结束时间
          // 剩余天数没有对应涉及表字段, 所以不设置收集? // 那么页面传参呢?
          // '@(schemas).dId14', // 生产商
        ]
      },
      // 方式1
      collectNN: {
        type: ComplexType.structObject,
        struct: [
          '@(schemas).dId0', // 隐藏的id
          '@(schemas).dId14', // 表格的数据
        ]
      },
      // 方式2
      // 提交/新增表单的收集描述
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
      }
    },
    dataChanged: {
      changeId1: {
        when: ['onUserChange'],
        condition: {},
        changeAction: ['@(actionCollection).actionId0'] // 实际上初始化回填也是个联动
      }
    }
  },
  actionsCollection: {
    // 初始化回填的APBDSL 「回填通过stateChange支持」
    actionId0: {
      // 单步、连表? 引用返回
      type: 'APBDSL_Action',
      // 查询表单详情的动作的触发时机
      when: ['updateAndPageMount', 'detailAndPageMount'],
      businessCode: 'fn0',
      // APB-DSL的步骤
      steps: [
        {
          // variable
          functionCode: 'TABLE_SELECT',
          params: {
            // TODO: 如果收集不通过, 应该不会有后续,这个如何体现?, 应该是一次收集完成, 然后分配,和处理关系「什么时机处理关系」?
            collect: 'collectId0', // set + table
            // 查询的条件
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
            }, // 对应配置
          },
          // 处理查询结构的Action, 可以对应生成APB-DSL自定义返回
          resultAction: '@(actionsCollection).actionId1'
        }
      ]
    },
    // 改变页面运行时状态 [可对应: 回填、输入、赋值给控件、联动的动作的赋值部分]
    actionId1: {
      type: 'stateChange',
      // 方式1: 根据收集关系, 反向映射
      changeTarger: '@(dataCollection).collectId1', // schemas/dataCollect
      // 方式2: A to B
      changeMapping: {
        '@(metadataMapping).tableId1.filedId1': '@(schemas).dId0',
        '@(metadataMapping).tableId1.filedId2': '@(schemas).dId1',
        // '@(metadataMapping).tableId1.filedId3': '@(schemas).dId3',
        '@(metadataMapping).tableId1.filedId3': '@(schemas).dId3.sdId1',
        '@(metadataMapping).tableId1.filedId4': '@(schemas).dId2',
      },
      when: [],
      conition: {},
    },
    // 插入/修改
    actionId2: {
      type: 'APBDSL_Action',
      when: ['insert'],
      businessCode: 'fn1',
      steps: [
        {
          functionCode: 'TABLE_INSERT',
          params: {
            collect: 'collectId1',
          }
        }
      ]
    },

    // TODO: 不能忽略的TODO
    // 页面初始化获取位置类型字典数据
    actionId3: {
      type: 'APBDSL_Action',
      when: ['pageMount'],
      businessCode: 'fn2',
      steps: [
        {
          functionCode: 'TABLE_SELECT',
          params: {
            table: 'location_type_table',
          },
          resultAction: '@(actionsCollection).actionId4' // 填入字典数据
        }
      ]
    },
    // 字典数据回填
    actionId4: {},
    // pid额外关系处理
    // 这个应该是处理关系的时候生成的, 还是配置平台生成? 但是特定关系的处理是会变的
    actionId5: {
      type: 'APBDSL_Action',
      when: ['updatePageMount', 'detailPageMount'],
      businessCode: 'fn3',
      steps: [
        {
          functionCode: 'TABLE_SELECT',
          params: {
            table: 'location',
            // 查询的条件
            condition: {
              conditionList: {
                condId1: {
                  operator: 'equ',
                  exp1: '@(metadataMapping).tableId1.filedId1',
                  exp2: '@(schemas).dId3'
                }
              },
              conditionControl: {
                and: ['condId1']
              }
            },
          },
          // 标准? 路径?
          resultAction: '@(actionsCollection).actionId4' // 填入上级位置的所有数据
        }
      ]
    },
  },
};

export default IUBLocationForm;
