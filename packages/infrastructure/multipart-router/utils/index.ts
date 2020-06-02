import { createBrowserHistory, Location } from "history";
import { urlParamsToQuery } from '@mini-code/request/url-resolve';

interface NavigateConfig {
  from?: Location;
  params?: {};
  type: string;
  route: string;
}

const history = createBrowserHistory();

let ROUTE_KEY = '_R';
const changeRouteKey = (routeKey: string) => {
  ROUTE_KEY = routeKey;
};
const getRouteKey = () => ROUTE_KEY;

const pushToHistory = (url: string, params?) => {
  history.push(url.replace(/\/\//g, '/'), params);
};

const replaceHistory = (url: string, params?) => {
  history.replace(url.replace(/\/\//g, '/'), params);
};

const wrapPushUrl = (pushConfig: NavigateConfig) => {
  const { href, hash } = window.location;
  const targetHash = hash.replace('#/', '').split('?')[0];
  const { route, params } = pushConfig;
  let result = urlParamsToQuery({
    params: {
      ...params,
      [ROUTE_KEY]: route,
    },
    toBase64: true
  });
  result = `${targetHash}${result.replace(/&&$/g, '')}`;
  return result;
};

/**
 * 导航者
 * @param {object} config { type: 'PUSH | GO_BACK | LINK', component: route, params: {} }
 */
const onNavigate = (config: NavigateConfig) => {
  if (!config) return console.log('Not config');
  const { location } = history;
  const nextConfig = {
    ...config,
    from: location
  };
  switch (nextConfig.type) {
    case "PUSH":
      pushToHistory(`#/${wrapPushUrl(nextConfig)}`, nextConfig);
      break;
    case "LINK":
      break;
    case "GO_BACK":
      history.goBack();
      break;
  }
};

export {
  history,
  wrapPushUrl,
  pushToHistory,
  changeRouteKey,
  replaceHistory,
  getRouteKey,
  onNavigate,
};
