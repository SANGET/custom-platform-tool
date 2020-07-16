import axios from 'axios';
// import { Message, Loading } from 'antd'
// import {encrypt, decrypt}  form 'xxx/tools'
// 创建axios实例
const instance = axios.create({
  baseURL: process.env.BASE_URL, // env === 'development' ? '/api' : window.location.protocol + '//' + window.location.host; // 配置axios请求的地址
  timeout: 10 * 1000, // 请求超时时间
  crossDomain: true, // 设置cross跨域
  withCredentials: true, // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
  'Content-Type': 'application/x-www-form-urlencoded',
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  transformRequest: [
    function (data) {
      // 对 data 进行任意转换处理
      return data;
    },
  ],
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    function (data) {
      // 对 data 进行任意转换处理--解密响应数据
      return JSON.parse(decrypt(data));
    },
  ],
});
/** 请求拦截器 * */
instance.interceptors.request.use(
  (config) => {
    // 给每个请求都加上token,让服务器判断请求是否过期
    config.headers.token = sessionStorage.getItem('token') || '';
    // 发起请求时加载全局loading，请求失败或有响应时会关闭
    // spinner.showFullScreenLoading()
    // 对请求参数进行加密
    if (['get', 'delete'].includes(config.method)) {
      // 默认是表单格式，可以配置成其它
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/x-www-form-urlencoded';
      // 如果是表单格式
      if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        const toQueryParams = (data) => {
          let ret = '';
          for (const it in data) {
            ret += `${encrypt(encodeURIComponent(it))}=${encrypt(encodeURIComponent(data[it]))}&`;
          }
          return ret;
        };
        config.params = toQueryParams(config.params);
      }
    } else {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
      config.data = encrypt(config.data);
    }
    // 导出或下载文件，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
    if (config.dowload) {
      config.headers.responseType = 'blob';
      delete config.download;
    }
    return config;
  },
  (error) => {
    // 请求错误做些什么
    // spinner.tryHideFullScreenLoading()
    return Promise.reject(error);
  }
);
/** 响应拦截器  * */
instance.interceptors.response.use(
  (response) => {
    // spinner.tryHideFullScreenLoading()
    if (response && response.status == 200) {
      const { data, config, status } = response;
      if (!data) {
        const message = '数据不存在';
        // fetchError(message, 200, config)
        return Promise.reject(message);
      }
      const { result, code, msg } = data;
      // 非正确业务码返回
      if (code !== '00000') {
        // fetchError({ msg, code, config })
        return Promise.reject(msg);
      }
      // 进入正常流程
      return Promise.resolve(data);
    }
    return Promise.reject;
  },
  (error) => {
    // spinner.tryHideFullScreenLoading()
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求';
          break;
        case 401:
          error.message = '未授权，请重新登录';
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = '请求错误,未找到该资源';
          break;
        case 405:
          error.message = '请求方法未允许';
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器端出错';
          break;
        case 501:
          error.message = '网络未实现';
          break;
        case 502:
          error.message = '网络错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网络超时';
          break;
        case 505:
          error.message = 'http版本不支持该请求';
          break;
        default:
          error.message = `连接错误${error.response.status}`;
          break;
      }
      const errorData = {
        status: error.response.status,
        message: error.message,
        config: error.response.config,
      };
      // fetchError(errorData.message, errorData.status, errorData.config);
      // 判断是否登录失效，按照实际项目的接口返回状态来判断,600是假设的未登陆或登陆态失效的http响应码
      if (error.response.status.includes('600')) {
        window.location.href = `${window.location.origin}/#/login`;
      }
    } else {
      // 其它未知错误
      // fetchError(error.message, '000', error.config);
    }
    return Promise.reject(error);
  }
);
export default instance;
