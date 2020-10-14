/** 查询表详情 */
export async function getTableInfo(id:string) {
  return await $R_P.get({
    url: `/data/v1/tables/${id}`,
    params: {},
  });
}
/** 查询模块列表 */
export async function getMenuListService(params) {
  return await $R_P.get({
    url: `/page/v1/menus/list`,
    params
  });
}
/* 查询字典列表 */
export async function getDictionaryList(params) {
  return await $R_P.get({
    url: '/data/v1/dictionary/list',
    params
  });
}
/** 查询表列表 */
export async function getTableList() {
  return await $R_P.get({
    url: `/data/v1/tables/list`,
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

/** 保存表数据 */
export async function editTableInfo(data) {
  return await $R_P.put(
    `/data/v1/tables/`,
    data
  );
}
