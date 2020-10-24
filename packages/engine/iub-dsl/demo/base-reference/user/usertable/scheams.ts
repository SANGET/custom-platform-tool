import { FoundationType, ComplexType } from "@iub-dsl/definition";

const genOrder = Math.floor(Math.random() * 10000);
const genAge = Math.floor(Math.random() * 100);
export const schemas = {
  entity_27: {
    type: ComplexType.structArray,
    struct: {
      sdId0: {
        fieldMapping: "tableId1.fieldId1",
        type: FoundationType.string,
        desc: '用户ID',
      },
      sdId1: {
        fieldMapping: "tableId1.fieldId1",
        type: FoundationType.string,
        desc: '用户名'
      },
      sdId2: {
        fieldMapping: "tableId1.fieldId1",
        type: FoundationType.string,
        desc: '用户描述'
      },
      sdId3: {
        fieldMapping: "tableId1.fieldId1",
        type: FoundationType.string,
        desc: '用户年龄'
      },
    }
  },
  search_01: {
    fieldMapping: "tableId1.fieldId1",
    type: FoundationType.string,
    defaultVal: ``,
    desc: ''
  },
  search_02: {
    fieldMapping: "tableId1.fieldId1",
    type: FoundationType.string,
    defaultVal: ``,
    desc: ''
  },
  search_03: {
    fieldMapping: "tableId1.fieldId1",
    type: FoundationType.string,
    defaultVal: ``,
    desc: ''
  },
};
