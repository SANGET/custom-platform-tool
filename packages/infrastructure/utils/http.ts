import axios from 'axios';
/** 对比了一下全局loading和动态创建loading,全局loading有个缺点就是在每个子应用中都得写一遍loading动画元素 */
/** 每个页面都得加上显示隐藏逻辑,不如动态创建loading灵活 */

// import { showLoading, hideLoading } from '@infra/ui/feedback/loading';
import { message as Msg } from 'antd';

// const { CancelToken } = axios;

// 当前正在请求的数量
// let requestCount = 0;
/** 登陆超时编码 */
const LoginTimeoutCode = [600];

// 创建axios实例
const Http = axios.create({
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  baseURL: process.env.BASE_URL, // env === 'development' ? '/api' : window.location.protocol + '//' + window.location.host; // 配置axios请求的地址
  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 30 * 1000, // 请求超时时间
  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: true,
  // `url` 是用于请求的服务器 URL
  url: '',

  // `method` 是创建请求时使用的方法
  method: 'post', // 默认是 get

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [(data) => {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [(data) => {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `headers` 是即将被发送的自定义请求头
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },
  // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  // paramsSerializer(params) {
  //   return Qs.stringify(params, { arrayFormat: 'brackets' });
  // },
  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {
    // firstName: 'Fred'
  },
  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  // adapter(config) {
  //   /* ... */
  // },

  // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {
    username: 'admin',
    password: 'password'
  },
  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // 默认的

  // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` 是承载 xsrf token 的值的 HTTP 头的名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认的

  // `onUploadProgress` 允许为上传处理进度事件
  // onUploadProgress(progressEvent) {
  //   // 对原生进度事件的处理
  // },

  // // `onDownloadProgress` 允许为下载处理进度事件
  // onDownloadProgress(progressEvent) {
  //   // 对原生进度事件的处理
  // },

  // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或
  // `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus(status) {
    return status >= 200 && status < 300; // 默认的
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  // maxRedirects: 5, // 默认的
  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  // httpAgent: new http.Agent({ keepAlive: true }),
  // httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  // proxy: {
  //   host: '127.0.0.1',
  //   port: 9000,
  //   auth: : {
  //     username: 'mikeymike',
  //     password: 'rapunz3l'
  //   }
  // },
  // `cancelToken` 指定用于取消请求的 cancel token
  // cancelToken: new CancelToken(((cancel) => {
  // }))
});
/** 请求拦截器 * */
Http.interceptors.request.use(
  (config) => {
    const { method } = config;
    // 发起请求时加载全局loading，请求失败或有响应时会关闭
    // requestCount为0，才创建loading, 避免重复创建
    // if (config.headers.isLoading) {
    //   requestCount = showLoading(requestCount);
    // }

    // 给每个请求都加上token,让服务器判断请求是否过期
    config.headers.token = sessionStorage.getItem('token') || '';

    // 对请求参数进行加密
    if (['get', 'delete'].includes(method as string)) {
      // 默认是表单格式，可以配置成其它
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/x-www-form-urlencoded';
      // 如果是表单格式
      if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        const toQueryParams = (data) => {
          let ret = '';
          for (const it in data) {
            ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`;
          }
          return ret;
        };
        config.params = toQueryParams(config.params);
      }
    } else {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    }
    // 导出或下载文件，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
    if (config.headers.dowload) {
      config.headers.responseType = 'blob';
      delete config.headers.download;
    }
    return config;
  },
  (error) => {
    // 判断当前请求是否设置了不显示Loading
    // if (error.config.headers.isLoading) {
    //   requestCount = hideLoading(requestCount);
    // }

    return Promise.reject(error);
  }
);
Http.interceptors.response.use((res) => {
  const { status, data } = res;
  // 判断当前请求是否设置了不显示Loading
  // if (config.headers.isLoading) {
  //   requestCount = hideLoading(requestCount);
  // }

  if (status === 200) {
    if (!data) {
      // const errMsg = '数据不存在';
      // fetchError(message, 200, config)
      return Promise.reject(status);
    }
    const { code, msg } = data;
    // 非正确业务码返回
    if (code && code !== '00000') {
      // fetchError({ msg, code, config })
      return Promise.reject(msg);
    }
    // console.log('res-xx进入正常流程', res);
    // 进入正常流程
    return Promise.resolve(res);
  }
  /** 必须有返回信息,这样写return Promise.reject会触发ts报警 */
  return Promise.reject(res);
},
(error) => {
  // if (error.config.headers.isLoading) {
  //   requestCount = hideLoading(requestCount);
  // }
  let errMsg = '';
  if (error.response) {
    const { status } = error.response;
    switch (status) {
      case 400:
        errMsg = '错误请求';
        break;
      case 401:
        errMsg = '未授权，请重新登录';
        break;
      case 403:
        errMsg = '拒绝访问';
        break;
      case 404:
        errMsg = '请求错误,未找到该资源';
        break;
      case 405:
        errMsg = '请求方法未允许';
        break;
      case 408:
        errMsg = '请求超时';
        break;
      case 500:
        errMsg = '服务器端出错';
        break;
      case 501:
        errMsg = '网络未实现';
        break;
      case 502:
        errMsg = '网络错误';
        break;
      case 503:
        errMsg = '服务不可用';
        break;
      case 504:
        errMsg = '网络超时';
        break;
      case 505:
        errMsg = 'http版本不支持该请求';
        break;
      default:
        errMsg = `连接错误${status}`;
    }
    // 弹出错误提示
    Msg.warning(errMsg);
    /** 登录超时跳转到登陆页 */
    if (LoginTimeoutCode.includes(status)) {
      window.location.href = `${window.location.origin}/#/login`;
    }
  }
  /** 捕获错误 */
  fetchError(error);
  return Promise.reject(error);
});

/**
 * 捕获错误
 * @param response --响应
 * @param request  -- 请求
 * @param config -- axios通用配置参数
 * @param message -- 出错信息
 */
function fetchError({
  response, request, config, message
}) {
  console.log({
    response, request, config, message
  });
}
export default Http;
