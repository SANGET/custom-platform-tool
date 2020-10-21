export async function getMenuListServices(params) {
  return await $R_P.get({
    url: '/page/v1/menus/list',
    params
  });
}

export async function createMenuServices(pageData) {
  return await $R_P.post({
    url: '/page/v1/menus/',
    data: pageData
  });
}

export async function delMenuServices(pageID) {
  return await $R_P.del({
    url: `/page/v1/menus/${pageID}`,
  });
}

export async function getPageListServices(params) {
  return await $R_P.get({
    url: '/page/v1/pages',
    params
  });
}

export async function editMenuServices(param) {
  return await $R_P.put(
    '/page/v1/menus/',
    param
  );
}
export async function addMenuServices(data) {
  return await $R_P.post({
    url: '/page/v1/menus/',
    data
  });
}
export async function setMenuStatusServices(param) {
  const { id, status } = param;
  return await $R_P.put(
    `/page/v1/menus/${id}/${status}`,
    param
  );
}
