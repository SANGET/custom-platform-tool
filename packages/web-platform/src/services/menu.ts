import request from '@/utils/request';

/**
 * 获取用户菜单
 * @param params
 */
export async function queryMenuList(params: API.IMeunParams) {
  return request<API.IMenunType>('/api/menu/list', {
    method: 'POST',
    data: params,
  });
}
