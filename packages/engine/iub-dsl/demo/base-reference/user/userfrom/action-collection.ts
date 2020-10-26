import { ActionCollection } from '@iub-dsl/definition/actions/action';
import {
  EnumCURD, ComplexType, FoundationType,
  ConditionOperator, MetadataMappingCollection, GeneralTableMapping
} from '@iub-dsl/definition';

import { FlowCollection } from '@iub-dsl/definition/flow';

interface ColumnItem {
  id: string
  name: string
  /** 数据类型 */
  colDataType: string
  /** 字段 size */
  fieldSize: string
  /** 字段类型 */
  fieldType: string
  /** 字段的名字 */
  fieldCode: string
}

interface DatasourceItem {
  /** 该条记录的 id */
  id: string
  /** 该条记录关联的表的 id */
  moduleId: string
  /** 名字 */
  name: string
  /** 类型 */
  type: string
  /** columns */
  columns: ColumnItem[]
}
export const metadata = {
  dataSource: {
    tableId1: {
      /** 该条记录的 id */
      id: 'tableId1',
      /** 该条记录关联的表的 id */
      moduleId: 'string',
      /** 名字 */
      name: 'test_user_k',
      /** 类型 */
      // type: 'string',
      type: 'general',
      /** columns */
      columns: {
        fieldId1: {
          id: 'fieldId1',
          name: 'string',
          /** 数据类型 */
          colDataType: 'string',
          /** 字段 size */
          fieldSize: 16,
          /** 字段类型 */
          fieldType: 'string',
          /** 字段的名字 */
          fieldCode: 'id',
          type: FoundationType.string,
        },
        fieldId2: {
          id: 'fieldId2',
          type: FoundationType.string,
          fieldCode: 'username',
          fieldSize: 64,
        },
        fieldId3: {
          id: 'fieldId3',
          type: FoundationType.string,
          fieldCode: 'address',
          fieldSize: 64,
        },
        fieldId4: {
          id: 'fieldId4',
          type: FoundationType.string,
          fieldCode: 'age',
          fieldSize: 64,
        },
      }
    }
  }
};

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
          table: '@(metadata).tableId1',
          fieldMapping: {
            actionId: 'entity_01_action1_dataCollection',
            actionName: 'entity_01_action1_dataCollection',
            actionType: 'dataCollection',
            actionOptions: {
              collectionType: ComplexType.structObject,
              struct: [
                {
                  field: '@(metadata).tableId1.fieldId1',
                  collectField: '$ID()',
                },
                {
                  field: '@(metadata).tableId1.fieldId2',
                  collectField: '@(schemas).entity_25'
                },
                {
                  field: '@(metadata).tableId1.fieldId3',
                  collectField: '@(schemas).entity_26'
                },
                {
                  field: '@(metadata).tableId1.fieldId4',
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
