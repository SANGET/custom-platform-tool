/**
 * 配置端的配置管理工具
 */

const AppConfig = {
  apiUrl: '',
  perviewAppUrl: ''
};

type ConfigKey = keyof typeof AppConfig

/**
 * 获取 app 配置
 * @param configKey
 */
export const getAppConfig = (configKey: ConfigKey) => {
  return configKey ? AppConfig[configKey] : AppConfig;
};

/**
 * 设置 app 配置
 * @param nextConfig
 */
export const setAppConfig = (nextConfig) => {
  // return configKey ? AppConfig[configKey] : AppConfig;
  Object.assign(AppConfig, nextConfig);
  window.$AppConfig = nextConfig;
};
