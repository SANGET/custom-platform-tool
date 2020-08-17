import { $R } from '../../services';

interface ResStruct {
  code: number
  message: string
  data?: any
}

/**
 * 登录 api
 * @param data 登录数据
 */
export function login(data) {
  return new Promise<ResStruct>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success'
      });
    }, 1000);
  });
  // return $R.post("/login", data);
}

/**
 * 主动登出
 */
export function logout() {
  return $R.post("/logout", {});
}
