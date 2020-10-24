import produce from 'immer';
import { BasePageData } from "@engine/visual-editor/data-structure";

export const wrapPageData = ({
  id,
  name = '测试',
  pageID,
  type = 2,
  pageMetadata,
  layoutInfo,
}): BasePageData => {
  // console.log(pageMetadata, layoutInfo, entitiesStateStore);

  return {
    content: layoutInfo,
    id,
    name,
    pageID,
    meta: {
      ...pageMetadata,
    }
  };
};
