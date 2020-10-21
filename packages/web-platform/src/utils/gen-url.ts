import { curry } from 'lodash';
// const egUrl = 'http://192.168.14.140:7091/hy/saas/haoyun/erp/business/34562'
// const baseUrl = 'http://192.168.14.140:7091/hy/saas';
const baseUrl = '';
// const baseUrl = '/apbdsl';
export const originGenUrl = (lesseeCode, appCode, businessCode) => {
  return `${baseUrl}/${lesseeCode}/${appCode}/business/${businessCode}`;
};
export const genUrl = curry(originGenUrl)('hy', 'iot');

export const APBDSLtestUrl = genUrl('UserInfo');
