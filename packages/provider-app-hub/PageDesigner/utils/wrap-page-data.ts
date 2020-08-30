import produce from 'immer';
import { BasePageData } from "@engine/visual-editor/types";

const mergeStateToContent = (layoutData, entityState) => {
  const res = produce(layoutData, (darftData) => {
    for (const item of darftData) {
      const entityID = item.id;
      item.props = {};
      Object.assign(item.props, entityState[entityID]);
    }
    return darftData;
  });

  return res;
};

export const wrapPageData = ({
  id,
  name = '测试',
  pageID,
  pageMetadata,
  layoutInfo,
}): BasePageData => {
  // console.log(pageMetadata, layoutInfo, entitiesStateStore);

  return {
    content: layoutInfo,
    id,
    name,
    pageID,
    meta: pageMetadata
  };
};
