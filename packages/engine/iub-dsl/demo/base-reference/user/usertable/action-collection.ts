import { ActionCollection } from '@iub-dsl/definition/actions/action';
import { EnumCURD, ComplexType, ConditionOperator } from '@iub-dsl/definition';
import { FlowCollection } from '@iub-dsl/definition/flow';

export const actionsCollection: ActionCollection = {
  entity_02: {
    actionId: 'entity_02_action1',
    actionName: 'TableSelect',
    actionType: 'APBDSLCURD',
    actionOptions: {
      businesscode: '34562',
      actionList: {
        apbA1: {
          type: EnumCURD.TableSelect,
          table: 'test_user_k',
          condition: {
            conditionControl: {
              and: ['condId0', 'condId1', 'condId2']
            },
            conditionList: {
              condId0: {
                operator: ConditionOperator.LIKE,
                exp1: 'username',
                exp2: '@(schemas).search_01'
              },
              condId1: {
                operator: ConditionOperator.LIKE,
                exp1: 'address',
                exp2: '@(schemas).search_02'
              },
              condId2: {
                operator: ConditionOperator.LIKE,
                exp1: 'age',
                exp2: '@(schemas).search_03'
              }
            }
          },
        }
      },
      actionStep: ['apbA1']
    },
    actionOutput: 'string', // TODO
  },
  entity_03: {
    actionId: 'entity_02_action2',
    actionName: 'updateState',
    actionType: 'updateState',
    actionOptions: {
      changeTarget: '@(schemas).entity_27'
    },
    actionOutput: 'undefined'
  },
  search_01: {
    actionId: 'search_01_action',
    actionName: 'updateState',
    actionType: 'updateState',
    actionOptions: {
      changeTarget: '@(schemas).search_01'
    },
    actionOutput: 'undefined'
  },
  search_02: {
    actionId: 'search_02_action',
    actionName: 'updateState',
    actionType: 'updateState',
    actionOptions: {
      changeTarget: '@(schemas).search_02'
    },
    actionOutput: 'undefined'
  },
  search_03: {
    actionId: 'search_03_action',
    actionName: 'updateState',
    actionType: 'updateState',
    actionOptions: {
      changeTarget: '@(schemas).search_03'
    },
    actionOutput: 'undefined'
  },
};

export const demoActionFlow: FlowCollection = {
  f_entity_02: {
    id: 'f_entity_02',
    actionId: '@(actions).entity_02',
    flowOutCondition: [],
    flowOut: [['f_entity_03']]
  },
  f_entity_03: {
    id: 'f_entity_03',
    actionId: '@(actions).entity_03',
    flowOutCondition: [],
    flowOut: []
  },
  f_search_01: {
    id: 'f_search_01',
    actionId: '@(actions).search_01',
    flowOutCondition: [],
    flowOut: []
  },
  f_search_02: {
    id: 'f_search_02',
    actionId: '@(actions).search_02',
    flowOutCondition: [],
    flowOut: []
  },
  f_search_03: {
    id: 'f_search_03',
    actionId: '@(actions).search_03',
    flowOutCondition: [],
    flowOut: [['f_e']]
  },
};
