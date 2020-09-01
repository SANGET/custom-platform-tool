import { $R } from '../../services';

/**
 * 登录 api
 * @param data 登录数据
 */
export async function login(data = {
  loginName: "hy",
  password: "123456"
}) {
  return await $R.post("/manage/v1/users/login", data);
}

/**
 * 主动登出
 */
export function logout() {
  return $R.post("/logout", {});
}
