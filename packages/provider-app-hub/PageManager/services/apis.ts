/**
 * 获取页面列表
 * @param params 条件
 */
export async function getPageListServices(params) {
  return await $R_P.get({
    url: '/page/v1/pages',
    params
  });
}
/**
 * 创建页面
 * @param pageData 页面基本数据
 */
export async function createPageServices(pageData) {
  return await $R_P.post({
    url: '/page/v1/pages',
    data: pageData
  });
}
/**
 * 删除页面
 * @param pageID 页面 ID
 */
export async function delPageServices(pageID) {
  return await $R_P.del({
    url: `/page/v1/pages/${pageID}`,
  });
}
/**
 * 获取左侧菜单
 * @param params 条件
 */
export async function queryMenusListService(params) {
  return await $R_P.get({
    url: `/page/v1/menus/list`,
    params
  });
}
/**
 * 发布页面
 * @param menuIds 菜单模块主键数组
 * @param pageInfoIds 页面主键数组
 */
export async function releasePageService(menuIds?: string[], pageInfoIds?: string[]) {
  return await $R_P.post({
    url: `/page/v1/pages/publishing`,
    data: { menuIds, pageInfoIds }
  });
}
