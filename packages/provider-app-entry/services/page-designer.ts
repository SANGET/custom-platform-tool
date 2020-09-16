export interface PageInfo {
  id: string
  name: string
  type: number
}

/**
 * 更新页面
 */
export async function updatePageService(pageInfo: PageInfo, extendData?) {
  if (!pageInfo) {
    return console.error('请传入 pageInfo');
  }
  const { id, name, type = 2 } = pageInfo;
  return await $R_P.put({
    url: `/page/v1/pages/${id}`,
    data: Object.assign({}, extendData, {
      name,
      type,
      /** TODO: 字段需要更改 */
      iubDsl: JSON.stringify(pageInfo),
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

export async function getDataSourceDetail(tableID) {
  const resData = await $R_P.get({
    url: `/data/v1/tables/${tableID}`,
  });

  return resData.result;
}
