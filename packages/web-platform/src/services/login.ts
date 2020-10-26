import HOSTENV from '@/utils/env';

export enum CLIENT_TYPE {
  "WEB" = 4
}
/**
 * 用户登录
 */
export async function accountLogin(params: API.ILoginParams) {
  const pageUrl = HOSTENV.get();
  return {
    data: {
      status: null,
      success: true,
      code: 0,
      message: "成功",
      access_token: "c2886b8c-b42d-4470-a742-73c9ec479c5c",
      token_type: "bearer",
      refresh_token: "9bd29ea0-60c7-46f0-90fc-2cc89dd507e0",
      expires_in: 3328,
      scope: "all"
    }
  };
  return $A_R(`${pageUrl.AUTH}/auth/token`, {
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
