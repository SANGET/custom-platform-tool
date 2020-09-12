import { FoundationType, ComplexType } from "@iub-dsl/core";
import { ActionFlowKeywork } from "@iub-dsl/core/types/actions/action-flow";
import { TypeOfIUBDSL } from "..";
import { ApbFunction } from "../../apb-dsl";

const a: TypeOfIUBDSL = {
  schemas: {
    dId1: {
      type: FoundationType.string,
      defaultVal: '@(expression).exp1', // 表达式/低代码
    },
    dId2: {
      type: FoundationType.string,
      defaultVal: '@(sys).userName' // 获取系统上下文
    },
    dId3: {
      type: FoundationType.string,
      defaultVal: '黎寨',
    }
  },
  relationshipsCollection: {
    dataCollection: {
      collectId1: {
        type: ComplexType.structObject,
        struct: ['dId2', 'dId1', 'dId3']
      }
    }
  },
  actionsCollection: {
    actionId0: {
      type: 'ApbAction',
      actionName: '多步骤变量的引用',
      businessCode: 'fn4',
      apbActionList: {
        apbActionId1: {
          type: ApbFunction.SET,
          table: '@(metadataMapping).tableId1',
          fieldMapping: '@(dataCollection).collectId1'
        },
        apbActionId2: {
          type: ApbFunction.SELECT,
          table: '@(metadataMapping).tableId2',
          condition: {
            conditionList: {
              cond1: {
                operator: 'equ',
                exp1: '@(metadataMapping).tableId1.filedId1',
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
  }
};
// 伪代码, 实际嵌套更深
actinWrapHandle(
  API(
    APBDSLMerge(
      flowControlHandle(
        [
          APBDSLTransformer(
            actionItemHandle({
              type: ApbFunction.SET,
              table: metadataFn('@(metadataMapping).tableId1'),
              fieldMapping: collectFn({
                type: ComplexType.structObject,
                struct: [
                  stateMenageGet('dId1', expressFn('@(expression).exp1')),
                  stateMenageGet('dId2', sysFn('@(sys).userName')),
                  stateMenageGet('dId3'),
                ]
              })
            }),
          )
          APBDSLTransformer(
            actionItemHandle({
              type: ApbFunction.SELECT,
              table: metadataFn('@(metadataMapping).tableId2'),
              condition: conditionHandle({
                conditionList: {
                  cond1: {
                    operator: 'equ',
                    exp1: metadataFn('@(metadataMapping).tableId1.filedId1'),
                    exp2: quoteRelationFn('#(apbActionId1).name')
                  }
                },
                conditionControl: conditionFlowHandle({
                  and: ['cond1']
                })
              })
            })
          )
        ]
      )
    )
  )
);

/**
 * 桥接协调: 3个重要思想
 * 1. 桥接模式
 * 2. 协调运行
 * 3. 依赖注入
 */
function Coordinator(params) { 
  const context = resolveParams(params)
  expressFn(context)
  sysFn(context)
  stateMenageGet(context)
  stateMenageGet(context)
  stateMenageGet(context)
  collectFn(context)
  metadataFn(context)
  actionItemHandle(context)
  APBDSLTransformer(context)
  metadataFn(context)
  quoteRelationFn(context)
  metadataFn(context)
  conditionHandle(context)
  conditionFlowHandle(context)
  actionItemHandle(context)
  APBDSLTransformer(context)
  flowControlHandle(context)
  APBDSLMerge(context)
  API(context)
}

/** 示意 */
// 收集后的数据
dId1: {
  sdId1: '张三',
  sdId2: '14',
}
cond1: {
  operator: 'equ',
  exp1: '@(metadataMapping).tableId1.filedId1',
  exp2: '@(schemas).dId1.sdId1'
}
// 标准通信+数据处理
mapConf: {
  from: 'schemas',
  to: 'metadata'
}
userInfo: {
  userName: '张三',
  age: '14'
}
cond1: {
  operator: 'equ',
  exp1: 'userName',
  exp2: '张三'
}
// 获取后的数据
userInfo: [
  {
    userName: '张三',
    age: '14'
  },
  {
    userName: '李四',
    age: '13'
  }
]
// 标准通信转换
mapConf: {
  from: 'metadata',
  to: 'schemas',
}
dId1: [
  {
    sdId1: '张三',
    sdId2: '14',
  },
  {
    sdId1: '李四',
    sdId2: '13',
  }
]
// 标准通信转换给组件使用
mapConf: {
  from: 'schemas',
  to: 'componentTag'
}
dId1: [
  {
    column1: '张三',
    column2: '14',
  },
  {
    column1: '李四',
    column2: '13',
  }
]
