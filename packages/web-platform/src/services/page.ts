import HOSTENV from '../utils/env';

/**
 * 获取页面数据
 * @param params
 */

const filterRes = (res) => {
  return res.data?.result || {};
};

/** 请求设计不合理,临时代码 */
const prevParam = {
  mode: 'prod',
  lessee: 'hy',
  app: 'iot'
};

const mergeParam = (params: API.IPageDataParams): API.IPageDataParams => {
  prevParam.mode = params.mode || prevParam.mode;
  prevParam.lessee = params.lessee || prevParam.lessee;
  prevParam.app = params.app || prevParam.app;
  return {
    ...prevParam,
    id: params.id,
  };
};

export const queryPageData = async (params: API.IPageDataParams) => {
  const pageUrl = HOSTENV.get();
  const res = await $A_R(`${pageUrl['NODE-WEB']}/node-web/page-data`, {
    method: 'GET',
    params: mergeParam(params),
  });
  return filterRes(res);
};
