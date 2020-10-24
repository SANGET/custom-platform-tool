/**
 * 获取当前用户信息
 */
export async function queryUserInfo() {
  return $A_R.post('http://localhost:8000/auth/user/info/cur');
}
