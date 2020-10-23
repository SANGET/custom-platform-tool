import {
  FoundationType, ComplexType, TypeOfIUBDSL, Schemas
} from '@iub-dsl/definition';
import { actionsCollection, demoActionFlow } from './action-collection';
import { schemas } from './scheams';
import { componentsCollection } from './components';

export const userTable = {
  sysRtCxtInterface: {} as any,
  schemas,
  metadataCollection: {} as any,
  relationshipsCollection: {},
  componentsCollection,
  actionsCollection: Object.assign({}, actionsCollection),
  flowCollection: Object.assign({}, demoActionFlow),
  layoutContent: {} as any,
  pageID: "userTable",
  name: "用户表格",
  type: "config"
};
