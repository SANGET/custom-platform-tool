import request from '@/utils/request';

export enum CLIENT_TYPE {
  "WEB" = 4
}
/**
 * 用户登录
 */
export async function accountLogin(params: API.ILoginParams) {
  return request<API.ILoginType>('/auth/token', {
    method: 'POST',
    data: params,
  });
}

/**
 * 用户退出
 */
export async function outLogin() {
  return request('/api/login/outLogin');
}
