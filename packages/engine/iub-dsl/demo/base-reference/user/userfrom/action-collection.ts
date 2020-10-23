import { ActionCollection } from '@iub-dsl/definition/actions/action';
import { EnumCURD, ComplexType, ConditionOperator } from '@iub-dsl/definition';
import { FlowCollection } from '@iub-dsl/definition/flow';

export const actionsCollection: ActionCollection = {
  entity_25: {
    actionId: 'entity_25_action1',
    actionName: 'updateState',
    actionType: 'updateState',
    actionOptions: {
      changeTarget: '@(schemas).entity_25'
    },
    actionOutput: 'undefined'
  },
  entity_26: {
    actionId: 'entity_26_action1',
    actionName: 'updateState',
    actionType: 'updateState',
    actionOptions: {
      changeTarget: '@(schemas).entity_26'
    },
    actionOutput: 'undefined'
  },
  entity_28: {
    actionId: 'entity_28_action1',
    actionName: 'updateState',
    actionType: 'updateState',
    actionOptions: {
      changeTarget: '@(schemas).entity_28'
    },
    actionOutput: 'undefined'
  },
  entity_01: {
    actionId: 'entity_01_action1',
    actionType: 'APBDSLCURD',
    actionName: 'TableInsert',
    actionOptions: {
      businesscode: '34562',
      actionList: {
        apbA1: {
          type: EnumCURD.TableInsert,
          table: 'test_user_k',
          fieldMapping: {
            actionId: 'entity_01_action1_dataCollection',
            actionName: 'entity_01_action1_dataCollection',
            actionType: 'dataCollection',
            actionOptions: {
              collectionType: ComplexType.structObject,
              struct: [
                {
                  aliasField: 'id',
                  collectField: '$ID()',
                },
                {
                  aliasField: 'username',
                  collectField: '@(schemas).entity_25'
                },
                {
                  aliasField: 'address',
                  collectField: '@(schemas).entity_26'
                },
                {
                  aliasField: 'age',
                  collectField: '@(schemas).entity_28'
                },
              ]
            },
            actionOutput: {
              type: ComplexType.structObject,
              struct: []
            },
          },
        }
      },
      actionStep: ['apbA1']
    },
    actionOutput: 'string'
  }
};

export const demoActionFlow: FlowCollection = {
  f_entity_25: {
    id: 'f_entity_25',
    actionId: '@(actions).entity_25',
    flowOutCondition: [],
    flowOut: []
  },
  f_entity_26: {
    id: 'f_entity_26',
    actionId: '@(actions).entity_26',
    flowOutCondition: [],
    flowOut: []
  },
  f_entity_28: {
    id: 'f_entity_28',
    actionId: '@(actions).entity_28',
    flowOutCondition: [],
    flowOut: []
  },
  f_entity_01: {
    id: 'f_entity_01',
    actionId: '@(actions).entity_01',
    flowOutCondition: [],
    flowOut: []
  },
};
