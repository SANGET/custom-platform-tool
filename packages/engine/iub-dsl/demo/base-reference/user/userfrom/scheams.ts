import { FoundationType, ComplexType } from "@iub-dsl/definition";

const genOrder = Math.floor(Math.random() * 10000);
const genAge = Math.floor(Math.random() * 100);
export const schemas = {
  entity_25: {
    fieldMapping: "tableId1.fieldId1",
    type: FoundationType.string,
    defaultVal: `张三${genOrder}`,
    desc: '用户名'
  },
  entity_26: {
    fieldMapping: "tableId1.fieldId1",
    type: FoundationType.string,
    defaultVal: `西湖区湖底公园1${genOrder}~@!!~`,
    desc: '用户描述'
  },
  entity_28: {
    fieldMapping: "tableId1.fieldId1",
    type: FoundationType.string,
    defaultVal: `${genAge}`,
    desc: '用户年龄'
  },
};
