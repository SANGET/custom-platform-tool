import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import router from './router';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
    immer: true,
  },
  history: { type: 'hash' },
  // layout: {
  //   name: '自定义平台基础数据管理服务',
  //   locale: false,
  // },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes: router,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  chainWebpack: (memo, { env, webpack, createCSSRule }) => {
    memo.module
      .rule('js')
      .test(/\.(js|mjs|jsx|ts|tsx)$/)
      .include.add(join(__dirname, '..', '..', '..', 'packages')).end()
      .exclude.add(/node_modules/).end()
      .use('babel-loader');
    return memo;
  },
});
