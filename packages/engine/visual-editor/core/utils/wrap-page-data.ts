import produce from 'immer';
import { BasePageData } from "../../data-structure";

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
