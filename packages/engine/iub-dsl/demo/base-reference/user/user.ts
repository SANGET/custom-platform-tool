import {
  FoundationType, ComplexType, TypeOfIUBDSL, Schemas
} from '@iub-dsl/definition';
import { actionsCollection } from './action-collection';
import { schemas } from './scheams';
import { componentsCollection } from './components';
import { flowActions, flowCollection } from './flow-collection';

export const userDemo = {
  sysRtCxtInterface: {} as any,
  schemas,
  metadataCollection: {} as any,
  relationshipsCollection: {},
  componentsCollection,
  actionsCollection: Object.assign({}, actionsCollection, flowActions),
  flowCollection,
  layoutContent: {
    type: "general",
    content: [{
      id: "entity_25", label: "文本框", type: "componentRef", compType: "FormInput", title: "文本框", componentID: "entity_25", refID: "entity_25"
    }, {
      id: "entity_26", label: "文本框", type: "componentRef", compType: "FormInput", title: "文本框", componentID: "entity_26", refID: "entity_26"
    }, {
      id: "entity_27", label: "表格", type: "componentRef", compType: "NormalTable", title: "文本框", componentID: "entity_27", refID: "entity_27"
    }, {
      id: "entity_28", label: "文本框", type: "componentRef", compType: "FormInput", title: "文本框", componentID: "entity_28", refID: "entity_28"
    }]
  } as any,
  pageID: "userDemo",
  name: "测试页面",
  type: "config"
};
