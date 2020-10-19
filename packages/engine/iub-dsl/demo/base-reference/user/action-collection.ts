import { ActionCollection } from '@iub-dsl/definition/actions/action';
import { EnumCURD, ComplexType } from '@iub-dsl/definition';

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
      /** 某个节点添加的子流程, 非主流程上的自流程 */
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
  },
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
  }
};
