export async function getDictionaryListServices(params) {
  return await $R_P.get({
    url: '/data/v1/dictionary/list',
    params
  });
}

export async function getListOfDictionaryServices({ id }) {
  return await $R_P.get({
    url: `/data/v1/dictionary/${id}`
  });
}
export async function getListOfDictionaryChildServices({ pid, dictionaryId }) {
  return await $R_P.get({
    url: `/data/v1/dictionary_value/${dictionaryId}/${pid}`
  });
}
export async function delChildOfDictionaryServices({ pid, dictionaryId }) {
  return await $R_P.del({
    url: `/data/v1/dictionary_value/${dictionaryId}/${pid}`,
  });
}
export async function delDictionaryServices(dictionaryId) {
  return await $R_P.del({
    url: `/data/v1/tables/${dictionaryId}`,
  });
}

export async function addDictionary(data) {
  return await $R_P.post('/data/v1/dictionary/', data);
}
export async function editDictionary(data) {
  return await $R_P.put('/data/v1/dictionary/', data);
}
export async function editChildOfDictionary(data) {
  return await $R_P.put('/data/v1/dictionary_value/', data);
}
export async function moveChildOfDictionary(data) {
  return await $R_P.put('/data/v1/dictionary_value/move', data);
}
