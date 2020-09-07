/*
 * @Author: your name
 * @Date: 2020-07-22 09:23:52
 * @LastEditTime: 2020-08-28 14:10:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\utils\http.ts
 */
import axios from 'axios';
import Qs from 'qs';
import {
  resHandler, errHandler, Msg
} from './http.tool';

/** 取消请求时要用 */
export const { CancelToken } = axios;

/** 创建axios实例 默认设置如下 */
const Http = axios.create({
  /** baseURL将自动加在 url 前面,除非 url 是一个绝对 URL */
  // baseURL: process.env.NODE_ENV === "development" ? '/api' : '',
  /** 后端设置了允许跨域访问请求 */
  baseURL: 'http://10.7.1.59:8080/paas/hy',
  /** timeout 指定请求超时的毫秒数(0 表示无超时时间), 如果请求话费了超过 timeout 的时间，请求将被中断 */
  timeout: 30 * 1000,
  /** withCredentials 表示请求跨域时是否带上cookie */
  withCredentials: true,
  headers: {
    // get: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    // post: {
    /**
    * 后端返回的数据是json格式
    */
    'Content-Type': 'application/json;charset=UTF-8'
    // }
  },
  /** 默认返回数据格式设置为json */
  responseType: 'json',
  /**
   * transformRequest 允许在向服务器发送前，修改请求数据
   * 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法中
   * 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
   */
  transformRequest: [(data, headers) => {
    /** 采用Http.post(url,data)发送的时候设置了application/json，里面又执行了一次JSON.parse,结果最终参数变成[object object] */
    /** 所以在这里要做一下对冲转换 */
    return JSON.stringify(data);
  }],
  /** transformResponse 在传递给 then/catch 前，允许修改响应数据 */
  transformResponse: [(data) => {
    // 对 data 进行任意转换处理
    return data;
  }],
  paramsSerializer(params) {
    return Qs.stringify(params, { arrayFormat: 'repeat' });
  }

});

Http.defaults.headers.common.Authorization = '1295915065878388737';

export const beforeEach = Http.interceptors.request;
export const afterEach = Http.interceptors.response;

/** 请求拦截器-可以添加多个，后添加的请求拦截器会比先添加的请求拦截器在请求前的过程中先执行 */
beforeEach.use(
  (config) => {
    // config.headers.token = sessionStorage.getItem('token') || '';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** 响应拦截器-可以添加多个，先添加的响应拦截器会在响应后先执行 */
afterEach.use((res) => {
  return resHandler(res);
},
(error) => {
  return errHandler(error);
});

export default Http;
export { Msg };
