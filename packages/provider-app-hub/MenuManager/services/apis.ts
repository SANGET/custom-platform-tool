export async function getMenuListServices() {
  return await $R_P.get({
    url: '/page/v1/menus/list'
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
