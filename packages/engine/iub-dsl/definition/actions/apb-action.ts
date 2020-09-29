import { ApbFunction } from "../../apb-dsl";
import {
  CollectionType, Condition, BasicActionConf, DataQuoteRelationRef
  // ApbActionFn
} from "..";
import { ActionsFlow } from "./action-flow";

/** 连表, 引用, 返回 */
// 如果收集不通过, 应该不会有后续,这个如何体现?
// 应该是一次收集完成, 然后分配,和处理关系「什么时机处理关系」?
const baseDemo = {
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
};
// select a.*, b.* from tablea a
// left join tableb b
// on a.id = b.id
// 收集前的key // TODO 连表, 关系「系统默认引用关系、用户可以额外配置」
/** CURD */
/** apb新增 */
interface ApbSetAction {
  table: string;
  type: ApbFunction.SET;
  // 转换后输出得结构
  // set: {
  // [str: string]: string | number
  // }[]
  fieldMapping: CollectionType | string // 数据收集关系 ? 还是id引用
}

/** apb修改 */
interface ApbUpdateAction {
  table: string;
  type: ApbFunction.UPD;
  fieldMapping: CollectionType // 数据收集关系 ? 还是id引用
  condition: Condition;
}

/** apb单表单步查询 */
interface ApbSelectAction {
  table: string;
  type: ApbFunction.SELECT;
  condition?: Condition;
  // fields // 这个应该需要
  // 统计类?
  // Apb额外字段
  // need_total
  // sort
  // group
}

/** apb删除 */
interface ApbDelAction {
  table: string;
  type: ApbFunction.DEL;
  condition: Condition;
}

/** CURD - End */
export type ApbFnAction = ApbSetAction | ApbUpdateAction | ApbSelectAction | ApbDelAction

/** apb-dsl相关的动作 */
export interface ApbAction extends BasicActionConf {
  type: 'ApbAction';
  /** 对应APB */
  businessCode: string;
  apbActionList: {
    [apbActionId: string]: ApbFnAction & DataQuoteRelationRef;
  };
  /** 库表操作可以执行的额外动作 */
  actionList?: {
    // [actionId: string]: ApbActionFn;
  };

  flow: ActionsFlow;
}
