/* eslint-disable no-param-reassign */
/**
 * 这里是根据具体业务的处理filter
 */

import { RequestClass, resolveUrl } from "@mini-code/request";
import { message as AntdMessage } from 'antd';

import { setDefaultParams, clearDefaultParams, onNavigate } from "multiple-page-routing";

/**
 * 后端返回的数据结构
 */
export interface ResStruct {
  code: string
  message: string
  results?: any
  result?: any
}

const urlPrefix = 'paas';
let baseReqUrl = '';

/**
 * 设置请求平台服务的 api 地址
 */
export const setPlatformApiUrl = (platformApiUrl: string) => {
  baseReqUrl = resolveUrl(platformApiUrl, urlPrefix);
  $R.setConfig({
    baseUrl: baseReqUrl
  });
};

/**
 * 根据业务扩展的 http 请求工具的类型
 */
export interface RExtend extends RequestClass {
  urlManager: typeof urlManager
}

const $R = new RequestClass<ResStruct>({
  // baseUrl: `${baseReqUrl}`
}) as RExtend;

/**
 * URL 管理器，根据实际业务需求设置 URL
 */
class UrlManager {
  currLessee = ''

  currApp = ''

  /** 登录后需要设置 */
  setLessee = (lessee: string) => {
    setDefaultParams({
      lessee
    });
    this.currLessee = lessee;
    this.setRequestBaseUrl();
  }

  /** 选择应用后需要设置 */
  setApp = (app: string) => {
    /** 设置默认的 url，让 url 带上 app 表饰 */
    setDefaultParams({
      app
    });
    this.currApp = app;
    this.setRequestBaseUrl();
  }

  /** 登出的时候需要设置 */
  reset = () => {
    this.currApp = '';
    this.currLessee = '';
    /** 清除默认 params */
    clearDefaultParams();
    $R.setConfig({
      baseUrl: baseReqUrl
    });
  }

  getUrl = () => {
    return resolveUrl(baseReqUrl, this.currLessee, this.currApp);
  }

  setRequestBaseUrl = () => {
    $R.setConfig({
      baseUrl: this.getUrl()
    });
  }
}

const urlManager = new UrlManager();

$R.urlManager = urlManager;

/**
 * 前端应该与服务端的接口分离
 * 通过此方法实现对接远端需要的 request 数据
 */
const beforeReq = (options) => {
  const {
    isCompress, method, data, ...params
  } = options;
  return {
    // header: Object.assign(
    //   {},
    //   getCommonHeader(data),
    //   {
    //     // Compress: isCompress ? 1 : 0,
    //     Method: method
    //   },
    //   { ...params }
    // ),
    // path: method,
    data
  };
};

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
const afterRes = (resData) => {
  if (typeof resData !== "object") resData = {};
  resData.data = resData.data || resData.Data || {};
  return resData;
};

/** 使用 $R 的中间件 */
// $R.use([beforeReq, afterRes]);

/**
 * 设置 $R 对象的 res
 */
function handleRes(resData) {
  const { code, msg } = resData;
  switch (code) {
    case '00000':
      // console.log('成功');
      break;
    case 'A0300':
      // console.log(resData);
      // 处理没找到应用的业务逻辑
      AntdMessage.error(msg);
      // onNavigate({
      //   type: 'PUSH',
      //   path: '/login',
      //   useDefaultParams: false
      // });
      break;
    default:
      AntdMessage.error(msg);
  }
}

const handleErr = (e) => {
  console.log(e);
};

/**
 * 监听 $R res 处理函数
 */
$R.on("onRes", handleRes);

/** 处理网络异常 */
$R.on("onErr", handleErr);

const $request = $R;

export { $request, $R };

export type $Request = typeof $R

declare global {
  const $R_P: typeof $R;
  interface Window {
    /** Request helper for Provider app，简写 R_P，$ 是全局变量前缀, 生产工具的 HTTP 请求助手 */
    $R_P: $Request;
  }
}

/**
 * 定义不可被更改的 $R_P 属性
 */
Object.defineProperties(window, {
  $R_P: {
    get() {
      return $R;
    },
    set() {
      return false;
    }
  }
});
