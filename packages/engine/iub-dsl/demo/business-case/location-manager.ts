import { TypeOfIUBDSL, ComplexType, FoundationType } from '@iub-dsl/types';

export const MockLocationType = [
  {
    type: '0', name: '建筑物分组'
  },
  {
    type: '1', name: '建筑物'
  },
  {
    type: '2', name: '楼层'
  },
  {
    type: '3', name: '区域'
  }
];

export const MockLocationData = [
  {
    id: 0,
    locationName: '天安科技园',
    locationType: '0',
    pid: null,
  },
  {
    id: 1,
    locationName: '浩云科技',
    locationType: '1',
    pid: 0,
  },
  {
    id: 2,
    locationName: '1楼',
    locationType: '2',
    pid: 1,
  },
  {
    id: 3,
    locationName: '培训室',
    locationType: '3',
    pid: 2,
  },
  {
    id: 4,
    locationName: '饭堂',
    locationType: '3',
    pid: 2,
  },
  {
    id: 5,
    locationName: '南村万博',
    locationType: '0',
    pid: null,
  },
  {
    id: 6,
    locationName: '万达广场',
    locationType: '1',
    pid: 5,
  },

];

const locationManage: TypeOfIUBDSL = {
  id: 'locationManage',
  type: 'config',
  name: '位置管理列表',

  sysRtCxtInterface: { },

  metadataCollection: {
    dataSource: {
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
    }
  },
  schemas: {
    // 输入表单三个
    dId1: {
      type: FoundationType.string,
      desc: '位置名称',
      alias: 'location_name',
      fieldMapping: '',
    },
    dId2: {
      type: FoundationType.string,
      desc: '位置类型',
      defaultVal: '建分组',
      alias: 'location_type',
      fieldMapping: ''
    },
    dId3: {
      type: FoundationType.string,
      desc: '上级位置',
      alias: 'pid',
      defaultVal: '',
      fieldMapping: ''
    },
    dId4: {
      type: ComplexType.structArray,
      desc: '位置类型数据',
      alias: '',
      struct: {
        sdId1: {
          type: FoundationType.string,
          fieldTag: 'type',
          fieldMapping: '',
          desc: '显示值'
        },
        sdId2: {
          type: FoundationType.string,
          fieldMapping: '',
          fieldTag: 'name',
          desc: '实际值'
        }
      }
    },
    dId5: {
      type: ComplexType.structArray,
      desc: '上级位置信息',
      alias: '',
      struct: {
        sdId1: {
          type: FoundationType.string,
          fieldTag: 'id',
          fieldMapping: '',
          desc: 'id'
        },
        sdId2: {
          type: FoundationType.string,
          fieldTag: 'locationName',
          fieldMapping: '',
          desc: '位置名称'
        },
        sdId3: {
          type: FoundationType.string,
          fieldTag: 'locationType',
          fieldMapping: '',
          desc: '位置类型'
        },
        sdId4: {
          type: FoundationType.string,
          fieldTag: 'pid',
          fieldMapping: '',
          desc: 'pid'
        },
      }
    },
    dId6: {
      type: FoundationType.boolean,
      desc: '控制选择上级显示隐藏',
      alias: '',
    },
    dId7: {
      type: ComplexType.structObject,
      struct: {
        sdId0: {
          type: ComplexType.structObject,
          struct: {
            ssdId1: {
              type: FoundationType.string,
            },
            ssdId2: {
              type: FoundationType.string
            }
          }
        },
        sdId1: {
          type: FoundationType.string,
        },
        sdId2: {
          type: ComplexType.structObject,
          struct: {
            ssdId1: {
              type: FoundationType.string,
            },
            ssdId2: {
              type: FoundationType.string
            }
          }
        }
      }
    },
  },
  componentsCollection: {
    searchInput: {
      id: 'searchInput',
      type: 'component',
      componentType: 'Input',
      props: {
        value: '@(schemas)dId1',
        key: 'searchInput',
        label: '位置名称'
      },
      actions: {
        onChange: {
          type: 'actionRef',
          actionID: 'inputChange'
        }
      }
    },
    locationType: {
      id: 'locationType',
      type: 'component',
      componentType: 'Selector',
      props: {
        value: '@(schemas)dId2',
        dataSource: '@(schemas)dId4',
        label: '位置类型',
        // TODO: 对象的
        showValue: 'sdId1',
        selValue: 'sdId2'
      },
      actions: {
        onChange: {
          type: 'actionRef',
          actionID: 'selectorChange' // 这里是多个事件的而且是串行的
        },
        // onMount: {
        //   type: 'actionRef',
        //   actionID: 'getLocationType' // 多个onMount
        // }
      }
    },
    pidInput: {
      id: 'pidInput',
      type: 'component',
      componentType: 'Input',
      props: {
        value: '@(schemas)dId3',
        key: 'pidInput',
        label: '上级位置'
      },
      actions: {
        onClick: {
          type: 'actionRef',
          actionID: 'inputChange'
        }
      }
    },
    addBtn: {
      id: 'addBtn',
      type: 'component',
      componentType: 'Button',
      props: {
        key: 'addBtn',
        text: '新增',
      },
      actions: {
        onClick: {
          type: 'actionRef',
          actionID: 'openAddLocationForm'
        }
      }
    },
    delBtn: {
      id: 'delBtn',
      type: 'component',
      componentType: 'Button',
      props: {
        key: 'delBtn',
        text: '删除'
      },
      actions: {
        onClick: {
          type: 'actionRef',
          actionID: 'openAddLocationForm' // 有选中的状态,然后弹出提示,然后数据收集然后提交
        }
      }
    },
    detailBtn: {
      id: 'detailBtn',
      type: 'component',
      componentType: 'Button',
      props: {
        key: 'detailBtn',
        text: '详情'
      },
      actions: {
        onClick: {
          type: 'actionRef',
          actionID: 'openAddLocationForm' // 有选中的状态, 弹窗, 导出值,引用值
        }
      }
    },
    // IUB-运行上下文记录,运行的激活状态 // 最好设计成数组的形式
    // TODO: 选中、聚焦
    table: {
      id: 'table',
      type: 'component',
      componentType: 'Table',
      style: {
        display: '@(schemas)dId6'
      },
      props: {
        dataSource: '@(schemas)dId5'
      },
      actions: {
        onClick: {
          type: 'actionRef',
          actionID: 'tableColClick'
        }
      }
    }
  },
  actionsCollection: {
    inputChange: { // 输入框更改的action 默认暂时不讨论
      flowCondition: {},
      flowControl: '',
      flowItems: {}
    },
    searchTable: { // 表格搜索
      flowItems: {},
      flowCondition: {},
      flowControl: ''
    },
    openAddLocationForm: { // 打开弹窗, 导出值、引用值
      flowControl: '',
      flowItems: {},
      flowCondition: {}
    },
    getLocationType: {
      flowControl: '',
      flowItems: { },
      flowCondition: {}
    },
    selectorChange: {
      flowControl: '',
      flowItems: { },
      flowCondition: {}
    },
    tableColClick: {
      flowControl: '',
      flowItems: { },
      flowCondition: {}
    }
  },
  relationshipsCollection: {
    dataCollection: {
      collectionId1: {
        type: 'objectStruct',
        isCheckGroup: false,
        struct: [
          '@(schemas)searchLocationName',
          '@(schemas)searchLocationType',
          '@(schemas)searchLocationPid',
        ]
      }
    }
  },
  layoutContent: {
    type: 'general',
    content: [
      {
        id: 'container1',
        type: 'container',
        layout: {
          type: 'flex',
          props: { }
        },
        body: [
          {
            id: 'comp1',
            type: 'componentRef',
            componentID: 'searchInput',
          },
          {
            id: 'comp2',
            type: 'componentRef',
            componentID: 'locationType',
          },
          {
            id: 'comp3',
            type: 'componentRef',
            componentID: 'pidInput',
          },
        ]
      },
      {
        id: 'container2',
        type: 'container',
        layout: {
          type: 'flex',
          props: { }
        },
        body: [
          {
            id: 'comp1',
            type: 'componentRef',
            componentID: 'addBtn',
          },
          {
            id: 'comp2',
            type: 'componentRef',
            componentID: 'delBtn',
          },
          {
            id: 'comp3',
            type: 'componentRef',
            componentID: 'detailBtn',
          },
        ]
      },
      {
        id: 'container3',
        type: 'container',
        layout: {
          type: 'flex',
          props: {}
        },
        body: [
          {
            id: 'comppp1',
            type: 'componentRef',
            componentID: 'table',
          }
        ]
      }
    ]
  },
};

const config = {
  onMount: {
    action1: {
      beforeAction: {
        onSubmitValid: true,
        onSubmitSelect: true,
        onSubmitConfirm: true,
      },
      action: 'openLink',
      actionConfig: {
        actionName: '',
        openMethod: '',
        openType: '',
        url: '',
        params: {}
      },
      condition: {
        description: [
          {
            variable: '@(schemas)UUIDX',
            operator: '=',
            value: '' // 系统变量、环境变量、运行时所有状态、表达式实时运行结构
          },
          {
            variable: '@(schemas)UUIDX',
            operator: '=',
            value: '' // 系统变量、环境变量、运行时所有状态、表达式实时运行结构
          },
        ],
        control: `[3] && ([1]||[2])`
      }
    },
    action2: {
      action: 'refresh',
      actionConfig: {
        actionName: '',
        target: 'compId', // 可能是数据、请求接口 等 1、需求没有明确「不合理」 2、需求必须实现,如何使用中间件实现
      }
    },
    action3: {
      action: 'Assignment',
      actionConfig: {
        actionName: '',
        list: [
          {
            target: 'compId', // ? 应该是指定的did、和cpid一一对应
            value: '' // runtimeState // 表达式
          }
        ]
      },
      action4: {},
      action5: {
        action: 'display',
        actionConfig: {
          actionName: '',
          // 按照这种方式, 如何和数据结合在一起
          show: '', // compId
          hide: '' // compId
        }
      },
      action6: {
        action: 'refreshPage' // closePage
      },
      action7: {
        action: '' // 物联操作
      },
      action8: {
        action: 'customFunc',
        actionConfig: {
          name: '',
          func: '',
          params: '',
          fillField: '', // 填充字段?
          isReturnConfirm: true
        }
      },
      action9: {
        action: 'code',
        actionConfig: {
          name: '',
          code: ''
        }
      }
    }
  }
};

// 非订阅发布和广播 而是命令

function collectionParam(params: string) {
  return params;
}
const context: any = {};

// when/cond 加入其中,而且要完整描述
/**
 * 1. do
 * 2. when、condition
 * 3. input、output  「structSchemas」 描述、解析、运行??
 * 4. flow
 * 5. changeState?
 */
// 一个库表的配置  // TODO: 这些操作是和数据相关的??  联动? A-》B C-》B B -》D  C-》D D -》E
// 内置函数? 定义好输入输出标准?
// 步骤解析? 每一步都按照流程的配置
const onClick = async () => {
  const collection = collectionParam('collectionId1');

  const transformMetaData = context.transformMetaData(collection); // 此处应该添加一个来对接apb

  const params = context.APBTransform(transformMetaData);

  const res = context.API(params);

  if (res) {
    context.feekBack('success');
  } else {
    context.feekBack('fail');
  }
};

const onLocationTypeSelect = async (
  selVal // 标准化后的值
) => {
  context.dispatchVal({ selVal });

  // 一步配置
  // 如何加上? 解析到数据变更的一些副作用?
  if (!context.vaild('@(schemas)selPid.type', selVal)) {
    context.dispatchVal({ '@(schemas)selPid': null });
  }
};

// 一步配置
const onOpenSelPid = async () => {
  const selRes = await context.open('url', { ref: ['@(schemas)selPid'] });
  context.dispatchVal({ selRes });
};

// 应该要按照配置,动态来组装

const update = async () => {
  const nowSel = context.getNowSel();

  if (nowSel && nowSel.length) {
    const openRes = await context.open('url', { input: { ...nowSel } });

    if (openRes) {
      // success
    } else {
      // failed
    }
  } else {
    // 未选中
  }
};

// cond??? when??
// 校验
// 值 // 默认值
// 数据变更 // 联动 // action
// 库表 // action
// 弹窗 // action
// 关联操作 // dataChange // attr??
// filter

export default locationManage;
