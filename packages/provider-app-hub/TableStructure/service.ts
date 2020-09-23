/** 获取表结构列表数据 */
export async function queryTableListService(params) {
  return await $R_P.get({
    url: '/data/v1/tables/list',
    params,
  });
}

/** 新增表 */
export async function createTableService(params) {
  return await $R_P.post({
    url: '/data/v1/tables/',
    data: params,
  });
}
/** 删除表前确认能否删除 */
export async function allowDeleteTableService(id) {
  return await $R_P.get({
    url: `/data/v1/tables/allowedDeleted/${id}`,
    params: {},
  });
}

/** 删除表 */
export async function deleteTableService(id) {
  return await $R_P.del({
    url: `/data/v1/tables/${id}`,
    data: {},
  });
}

/** 复制表 */
export async function copyTableService(params) {
  return await $R_P.post({
    url: '/data/v1/tables/copy',
    data: params,
  });
}

/** 查询 菜单 */
export async function queryMenusListService(params) {
  return await $R_P.get({
    url: `/page/v1/menus/list`,
    params
  });
}

/** 新增菜单 */
export async function createMenuService(params) {
  return await $R_P.post({
    url: `/page/v1/menus/`,
    data: params
  });
}
