/**
 * 这里是根据具体业务的处理filter
 */

import { RequestClass } from "@mini-code/request";

import { EventEmitter } from "@mini-code/base-func";
import { getPrevLoginToken } from "../auth/actions/store";
import { ApiResponse } from "../types/api-struct";

declare global {
  interface Window {
    COMMON_REQ_HEADER: {};
  }
}

const token = getPrevLoginToken();

/** 初始化时添加统一的 res 类型 */
const $R = new RequestClass<ApiResponse>({
  baseUrl: "http://localhost:5566",
  commonHeaders: token
    ? {
      authorization: token
    }
    : {}
  // fetchOptions: {
  //   credentials: 'include'
  // }
});

EventEmitter.on("LOGIN_SUCCESS", ({ loginRes }) => {
  $R.setConfig({
    commonHeaders: {
      authorization: loginRes.token
      // 'Access-Control-Allow-Headers': '*',
      // 'Access-Control-Allow-Origin': '*',
    }
    // fetchOptions: {
    //   credentials: 'include',
    //   mode: 'cors'
    // }
  });
});

$R.checkStatus = (originRes) => originRes.status === 200;

/**
 * 前端应该与服务端的接口分离
 * 通过此方法实现对接远端需要的 request 数据
 */
// const beforeReq = (options) => {
//   const {
//     isCompress, method, data, ...params
//   } = options;
//   return {
//     header: {
//       ...getCommonHeader(),
//       Compress: isCompress ? 1 : 0,
//       Method: method,
//       ...params
//     },
//     // path: method,
//     data
//   };
// };

/**
 * 前端应该与服务端的接口分离
 * 通过此方法实现对接 response 数据
 * 前端统一接口
 * resData = {
 *   data: {} || [], // 对接远端接口的数据
 *   paging: {},     // 分页信息
 *   resCode: '',    // response 的业务代码，0 或者没有代指业务错误
 *   err: null || 'description' // 对接 response 的错误描述
 * }
 */
// const afterRes = (resData) => {
//   let _resData = resData;
//   if (typeof resData !== 'object') _resData = {};
//   _resData.data = _resData.data || _resData.Data || {};
//   return _resData;
// };

// /** 使用 $R 的中间件 */
// $R.use([(data) => data, afterRes]);

/**
 * 设置 $R 对象的 res
 */
function handleRes({ resData, callback }) {
  // let errcode = resData.errCode;
  // switch (errcode) {
  //   case '1':
  //   case '2':
  //   case '3':
  //     // TODO 处理登录错误的业务
  //     // onLoginFail(errcode.Desc);
  //     break;
  // }
}

/**
 * 监听 $R res 处理函数
 */
$R.on("onRes", handleRes);

const $request = $R;

export { $request, $R };
