/**
 * 更新页面
 */
export async function updatePageService(pageInfo, pageContent, extendData?) {
  if (!pageInfo) {
    return console.error('请传入 pageInfo');
  }
  const updatePageData = Object.assign({}, pageInfo, extendData, {
    pageContent: JSON.stringify(pageContent),
  });
  console.log('pageContent', pageContent);
  return await $R_P.put({
    url: `/page/v1/pages/${pageInfo.id}`,
    data: updatePageData
  });
}

/**
 * 获取页面详情
 */
export async function getPageDetailService(pageID: string) {
  const pageData = await $R_P.get(`/page/v1/pages/${pageID}`);
  // 为了兼容未来的字段更改
  const { result } = pageData;
  if (!result) return {};
  let pageContent;
  try {
    pageContent = JSON.parse(result.pageContent);
  } catch (e) {
    console.log('暂无数据');
  }
  result.pageContent = pageContent;
  return result;
}

export async function getDataSourceDetail(tableID) {
  const resData = await $R_P.get({
    url: `/data/v1/tables/${tableID}`,
  });

  return resData?.result;
}
