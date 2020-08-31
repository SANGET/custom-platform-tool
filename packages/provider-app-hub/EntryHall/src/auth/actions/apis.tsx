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
  // return new Promise((resolve) => {
  //   $R.post("/manage/v1/users/login", data)
  //     .then((res) => {
  //       res.token = '1295915065878388737';
  //       /** TODO: 完善 token 管理 */
  //       $R.setConfig({
  //         commonHeaders: {
  //           Authorization: '1295915065878388737'
  //         }
  //       });
  //       resolve(res);
  //     });
  // setTimeout(() => {
  //   resolve({
  //     code: 0,
  //     message: 'success'
  //   });
  // }, 1000);
  // });
}

/**
 * 主动登出
 */
export function logout() {
  return $R.post("/logout", {});
}
