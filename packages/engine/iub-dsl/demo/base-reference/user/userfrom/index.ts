import { actionsCollection, demoActionFlow, metadata } from './action-collection';
import { schemas } from './scheams';
import { componentsCollection } from './components';

export const userForm = {
  schemas,
  metadataCollection: metadata,
  relationshipsCollection: {},
  componentsCollection,
  actionsCollection: Object.assign({}, actionsCollection),
  flowCollection: Object.assign({}, demoActionFlow),
  layoutContent: {} as any,
  pageID: "userForm",
  name: "用户表单",
  type: "config"
};
