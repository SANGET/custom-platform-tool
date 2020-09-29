import { createBrowserHistory, Location } from "history";
import produce from "immer";
import { urlParamsToQuery } from "@mini-code/request/url-resolve";
import { wrapPathWithSeperator } from ".";

export interface NavParams {
  [key: string]: any;
}

export interface NavigateConfig {
  /** 从哪里来，由程序写入 */
  from?: Location
  /** 路由参数 */
  params?: NavParams
  /** 路由类型 */
  type: 'PUSH' | 'GO_BACK' | 'LINK' | 'POP'
  /** 需要跳转的路由，废弃的，需要换成 path */
  route?: string
  /** pathname */
  path: string
  /** 扩展 pathname，用于同一个 /pathname 对应的页面打开多个实例 */
  pathExtend?: string
  /** 是否使用默认的 params，会在 url 中加入 */
  useDefaultParams?: boolean
}

export const history = createBrowserHistory();

/**
 * 回到根路由路径
 */
export const redirectToRoot = () => history.replace('/');

/**
 * push to history
 */
export const pushToHistory = (url: string, historyState?) => {
  history.push(url.replace(/\/\//g, "/"), historyState);
};

/**
 * replace history
 */
export const replaceHistory = (url: string, historyState?) => {
  history.replace(url.replace(/\/\//g, "/"), historyState);
};

let _defaultParams = {};

/**
 * 为每次路由调整添加默认的 params url
 */
export const setDefaultParams = (
  defaultParams: NavParams
) => {
  _defaultParams = produce(defaultParams, (draft) => {
    return {
      ...draft,
      ...defaultParams
    };
  });
};

/**
 * 包装通过 push 方式的 url 格式
 */
export const wrapPushUrl = (pushConfig: NavigateConfig) => {
  // const { href, hash } = window.location;
  // const targetHash = hash.replace("#/", "").split("?")[0];
  const {
    path, pathExtend, params, useDefaultParams = true
  } = pushConfig;
  const pathname = pathExtend ? wrapPathWithSeperator([path, pathExtend]) : path;
  let result = urlParamsToQuery({
    params: Object.assign({}, params,
      // {
      //   [ROUTE_KEY]: path
      // }
      useDefaultParams && _defaultParams,),
    toBase64: true,
  });
  result = `${pathname}${result.replace(/&$/g, "")}`;
  return result;
};

export type OnNavigate = (config: NavigateConfig) => void

/**
 * 设置导航器
 */
export const clearDefaultParams = () => {
  _defaultParams = {};
};

/**
 * 导航器
 */
export const onNavigate: OnNavigate = (config) => {
  if (!config) {
    throw Error('需要传入 config，请检查调用');
  }
  const { path } = config;
  if (!path) return;
  const { location } = history;
  const nextConfig = produce(config, (draft) => {
    draft.from = location;
  });
  const { type } = nextConfig;
  switch (type) {
    case "PUSH":
      pushToHistory(`#/${wrapPushUrl(nextConfig)}`, nextConfig);
      break;
    case "LINK":
      break;
    case "POP":
    case "GO_BACK":
      history.goBack();
      break;
    default:
      throw Error(`没找到类型 ${type}`);
  }
};
