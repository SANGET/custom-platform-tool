import { $R } from '../../services';

/**
 * 登录 api
 * @param data 登录数据
 */
export async function login(data = {
  loginName: "hy",
  password: "123456"
}) {
  const res = await $R.post("/manage/v1/users/login", data);
  return res;
}

/**
 * 主动登出
 */
export async function logout() {
  const res = await $R.post("/logout", {});
  $R_P.urlManager.reset();
  return res;
}
