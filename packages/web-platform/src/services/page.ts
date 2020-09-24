import request from '@/utils/request';

/**
 * 获取页面数据
 * @param params
 */
export async function queryPageData(params: API.IPageDataParams) {
  return request<API.IPageDataType>('/web/page-data', {
    method: 'GET',
    params: params,
  });
}
