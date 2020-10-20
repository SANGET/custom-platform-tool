import HOSTENV from '../utils/env';

/**
 * 获取页面数据
 * @param params
 */
export async function queryPageData(params: API.IPageDataParams) {
  const pageUrl = HOSTENV.get();
  return $A_R(`${pageUrl['NODE-WEB']}/node-web/page-data`, {
    method: 'GET',
    params,
  });
}
