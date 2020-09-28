/**
 * 应用管理 API
 */

/**
 * 获取应用
 */
export async function GetApplication() {
  return await $R_P.get('/manage/v1/applications');
}
