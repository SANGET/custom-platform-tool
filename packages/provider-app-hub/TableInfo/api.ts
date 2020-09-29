/** 查询表详情 */
export async function getTableInfo(id) {
  return await $R_P.get({
    url: `/data/v1/tables/${id}`,
    params: {},
  });
}/** 查询模块列表 */
export async function queryMenusListService(params) {
  return await $R_P.get({
    url: `/page/v1/menus/list`,
    params
  });
}
/* 查询字典列表 */
export async function GetDictList(params) {
  return await $R_P.get({
    url: '/data/v1/dictionary/list',
    params
  });
}
/* 判断是否可删除 */
export async function allowedDeleted(params) {
  const { tableId, columnId } = params || {};
  return await $R_P.get({
    url: `/data/v1/tables/column/allowedDeleted/${tableId}/${columnId}`,
    params
  });
}
/** 查询表列表 */
export async function queryTablesList() {
  return await $R_P.get({
    url: `/data/v1/tables/list`,
  });
}

/** 更新表配置 */
export async function updateTableInfo(params) {
  return await $R_P.put({
    url: `/data/v1/tables/`,
    params
  });
}
