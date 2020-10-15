const R = require('ramda')
const axios = require('axios')

async function getUserName() {
  const res = await axios.get("https://s.igola.com/web-gateway/api-data-service/data/find-oversea-hot/EN")
  return res?.data?.resultCode
}
// @ts-ignore
window.FX = {
  SUM: R.add,
  GETUSERNAME: getUserName
}
