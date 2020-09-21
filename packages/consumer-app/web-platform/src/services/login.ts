import request from '@/utils/request';

export enum CLIENT_TYPE {
  "WEB" = 4
}
export interface ILoginParams{
  username: string;
  password: string;
  clientType: CLIENT_TYPE;
}
export interface APILogin {
  success: boolean;
  code: number;
  message: string;
  dataId: null;
  result: null;
}
/**
 * 用户登录
 */
export async function accountLogin(params: ILoginParams) {
  return request<APILogin>('/api/login/account', {
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
