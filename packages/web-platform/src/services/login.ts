export enum CLIENT_TYPE {
  "WEB" = 4
}
/**
 * 用户登录
 */
export async function accountLogin(params: API.ILoginParams) {
  return $A_R('/auth/token', {
    method: 'POST',
    data: params,
  });
}

/**
 * 用户退出
 */
export async function outLogin() {
  return $A_R('/api/login/outLogin');
}
