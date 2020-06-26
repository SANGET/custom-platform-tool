/**
 * TODO: 封装数据转换器和 API 通讯模块
 */
import APBDSLTransformer from '@infra/data-transformer/apb-dsl';
import http from '@infra/remote-services/http';
import { ResponseOfIUBDSL, RequestAPIOfIUBDSL } from '@iub-dsl/parser/types/request-types';

/** TODO: 完善通讯模块的接口 */
export interface RequestParams extends RequestAPIOfIUBDSL {
  // 占位
  before?: () => {};
  after?: () => {};
}

export interface Response extends ResponseOfIUBDSL {
  // 占位
  data: any
}

const $Request = (reqData: RequestParams): Promise<Response> => {
  return new Promise((resolve) => {
    reqData?.before();

    const httpRes = http({
      method: 'GET',
      data: APBDSLTransformer(reqData)
    });

    reqData?.after();

    resolve(httpRes);
  });
};

export default $Request;
