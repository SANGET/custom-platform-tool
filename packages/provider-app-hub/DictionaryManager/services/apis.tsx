export async function getDictionaryListServices() {
  return await $R_P.get({
    url: '/data/v1/dictionary/list'
  });
}

export async function createPageServices(dictionaryData) {
  return await $R_P.post({
    url: '/data/v1/dictionary/',
    data: dictionaryData
  });
}

export async function delDictionaryServices(dictionaryId) {
  return await $R_P.del({
    url: `/data/v1/tables/${dictionaryId}`,
  });
}
