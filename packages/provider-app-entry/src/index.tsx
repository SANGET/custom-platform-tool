import React from 'react';
import ReactDOM from "react-dom";
import { setAppConfig } from '@provider-app/config/config-manager';

import App from './main';
import { setPlatformApiUrl } from './services';

fetch('/config.json').then((res) => res.json()).then((config) => {
  // console.log(config);
  /**
   * 准备应用的配置数据
   * 1. 设置配置
   * 2. 设置请求平台服务的 api 地址
   */
  setAppConfig(config);
  setPlatformApiUrl(config.apiUrl);
  ReactDOM.render(<App />, document.querySelector("#Main"));
});
