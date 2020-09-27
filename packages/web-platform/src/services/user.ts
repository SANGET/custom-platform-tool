import request from '@/utils/request';

/**
 * 获取单前用户信息
 */
export async function queryCurrent() {
  return request<API.ICurrentUserType>('/auth/user/info/cur');
}
