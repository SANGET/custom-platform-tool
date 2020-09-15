import { BasePageData } from "@engine/visual-editor/types";

/**
 * 更新页面
 */
export async function updatePageService(pageContent: BasePageData, sourcePageData?) {
  const { id } = pageContent;
  return await $R_P.put({
    url: `/page/v1/pages/${id}`,
    data: Object.assign({}, sourcePageData, {
      name: pageContent.name,
      type: 2,
      /** TODO: 字段需要更改 */
      iubDsl: JSON.stringify(pageContent),
    })
  });
}

/**
 * 获取页面详情
 */
export async function getPageDetailService(pageID: string) {
  const pageData = await $R_P.get(`/page/v1/pages/${pageID}`);
  // 为了兼容未来的字段更改
  const { result } = pageData;
  let pageContent;
  try {
    pageContent = JSON.parse(result.iubDsl);
  } catch (e) {
    console.log('暂无数据');
  }
  result.pageContent = pageContent;
  return result;
}
