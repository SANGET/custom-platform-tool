export async function getPageListServices() {
  return await $R_P.get({
    url: '/page/v1/pages'
  });
}

export async function createPageServices(pageData) {
  return await $R_P.post({
    url: '/page/v1/pages',
    data: pageData
  });
}

export async function delPageServices(pageID) {
  return await $R_P.del({
    url: `/page/v1/pages/${pageID}`,
  });
}
